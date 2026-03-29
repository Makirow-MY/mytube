import { db } from "@/db";
import { users, videos, videosViews, videoUpdateSchema } from "@/db/schema";
import {z} from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc, getTableColumns, exists } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { mux } from "@/lib/mux";
import { UploadThingError, UTApi } from "uploadthing/server";

export const videosViewsRouter = createTRPCRouter({
   
    create: protectedProcedure
    .input(z.object({
        videoId: z.string()
    }))
    .mutation(async ({ctx, input}) => {

        try{
        const {id: userId} = ctx.user;
         const {videoId} = input;
        console.log(ctx.user)

        if(!userId){
             throw new TRPCError({code: "UNAUTHORIZED", message: "Missing User Id, Try Signing In Again"});
             
        }

        if(!videoId){
             throw new TRPCError({code: "NOT_FOUND", message: "Missing video Id, Try Signing In Again"});
             
        }


        const [exitingVideoViews] = await db.select().from(videosViews)
        .where(and(
            eq(videosViews.userId, userId),
            eq(videosViews.videoId, videoId)
        ))

 if(exitingVideoViews){
            return exitingVideoViews;  
        }

       const [newVideoView] = await db.insert(videosViews).values({
            userId,
            videoId,
        }).returning() 


        return newVideoView;
       
    }
    catch(error) {
         throw new TRPCError({code: "TOO_MANY_REQUESTS", message: `${error}`});
    }
    }),

});