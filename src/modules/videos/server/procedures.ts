import { db } from "@/db";
import { users, videos, videosReactions, videosViews, videoUpdateSchema } from "@/db/schema";
import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc, getTableColumns, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { mux } from "@/lib/mux";
import { UploadThingError, UTApi } from "uploadthing/server";

export const videosRouter = createTRPCRouter({
    restoreThumbnail: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const { id: userId } = ctx.user
                const [ExistingVideo] = await db.select().from(videos)
                    .where(and(
                        eq(videos.id, input.id),
                        eq(videos.userId, userId),
                    ))

                if (!ExistingVideo) {
                    throw new TRPCError({ code: "NOT_FOUND" })
                }

                if (ExistingVideo.thumbnailKey) {
                    const utapi = new UTApi();

                    await utapi.deleteFiles(ExistingVideo.thumbnailKey);
                    await db.update(videos).set({
                        thumbnailUrl: null,
                        thumbnailKey: null,
                    }).where(and(
                        eq(videos.id, input.id),
                        eq(videos.userId, userId),
                    ))
                }

                if (!ExistingVideo.muxPlaybakId) {
                    throw new TRPCError({ code: "BAD_REQUEST" })
                }

                const tempThumbnailUrl = `https://image.mux.com/${ExistingVideo.muxPlaybakId}/thumbnail.jpg`

                const utapi = new UTApi()
                const UPthumbnailUrl = await utapi.uploadFilesFromUrl(tempThumbnailUrl)

                if (!UPthumbnailUrl.data) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
                }

                const { key: thumbnailKey, ufsUrl: thumbnailUrl } = UPthumbnailUrl.data



                const [UpdateVideo] = await db.update(videos).set({ thumbnailUrl, thumbnailKey })
                    .where(and(
                        eq(videos.id, input.id),
                        eq(videos.userId, userId),
                    )).returning();

                return UpdateVideo;
            } catch (error) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
            }

        }),
    remove: protectedProcedure.input(z.object({
        id: z.string()
    })).mutation(async ({ ctx, input }) => {
        try {
            const { id: userId } = ctx.user
            const [removeVideo] = await db.delete(videos)
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                )).returning()

            if (!removeVideo) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            return removeVideo;
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
        }

    })
    ,
    update: protectedProcedure.input(videoUpdateSchema).mutation(
        async ({ ctx, input }) => {
            try {
                const { id: userId } = ctx.user;

                if (!input.id) {
                    throw new TRPCError({ code: "BAD_REQUEST" })
                }

                const [updateVideo] = await db.update(videos)
                    .set({
                        title: input.title,
                        description: input.description,
                        categoryId: input.categoryId,
                        videoVisibility: input.videoVisibility,
                        updatedAt: new Date()
                    }).where(and(
                        eq(videos.id, input.id),
                        eq(videos.userId, userId)
                    )).returning()


                if (updateVideo)
                    throw new TRPCError({ code: "NOT_FOUND" })
            }
            catch (error) {

            }
        }
    )
    ,
    create: protectedProcedure.mutation(async ({ ctx }) => {

        try {
            const { id: userId } = ctx.user;
            console.log(ctx.user)

            if (!userId) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing User Id, Try Signing In Again" });

            }


            const upload = await mux.video.uploads.create({
                new_asset_settings: {
                    passthrough: userId,
                    playback_policies: ["public"],
                    inputs: [
                        {
                            generated_subtitles: [
                                {
                                    language_code: "en",
                                    name: "English",
                                }]
                        }
                    ]
                },
                cors_origin: "*",
            })

            if (!upload.id) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to upload vidieo" });
            }

            const [video] = await db.insert(videos).values({
                userId,
                title: "Untitled",
                muxStatus: "waiting",
                muxUploadId: upload.id
            }).returning();

            if (!video) {
                throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Failed To Publish Video" });

            }

            return {
                video: video,
                url: upload.url
            };
        }
        catch (error) {
            throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: `${error}` });
        }
    }),

    getOne: baseProcedure.input(z.object({
        id: z.string()
    })).query(
        async ({ input, ctx }) => {
            const clerkUserId = ctx.clerkUserId;
            let userId;

            const [user] = await db.select().from(users).where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

            if (user) {
                userId = user.id;
            }
            const viewerReactions = db.$with("viewer_reactions").as(
                db.select({
                    videoId: videosReactions.videoId,
                    type: videosReactions.type,
                }).from(videosReactions)
                    .where(inArray(videosReactions.userId, userId ? [userId] : []))
            );


            const [existingVid] = await db
                .with(viewerReactions)
                .select({
                    ...getTableColumns(videos),
                    user: {
                        ...getTableColumns(users)
                    },
                    viewCount: db.$count(videosViews, eq(videosViews.videoId, videos.id)),
                    likeCount: db.$count(videosReactions,
                        and(
                            eq(videosReactions.videoId, videos.id),
                            eq(videosReactions.type, "like")
                        )),
                    dislikeCount: db.$count(videosReactions, and(
                        eq(videosReactions.videoId, videos.id),
                        eq(videosReactions.type, "dislike")
                    )),
                    viewerReaction: viewerReactions.type

                }).from(videos)
                .innerJoin(users, eq(videos.userId, users.id))
                .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
                .where(eq(videos.id, input.id))
                // .groupBy(
                //     videos.id,
                //     users.id,
                //     viewerReactions.type
                // )

            if (!existingVid) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Missing User Id, Try Signing In Again" });

            }

            return existingVid;

        }
    ),
});