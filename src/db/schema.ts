import {pgTable, text, uuid, timestamp, uniqueIndex, integer, pgEnum, primaryKey} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema, createUpdateSchema} from "drizzle-zod"
import { view } from "drizzle-orm/sqlite-core";

const users = pgTable("users",{
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)])

export const userRelations = relations(users, ({many}) => ({
    videos: many(videos),
    videoViews: many(videosViews),
    videoReactions: many(videosReactions),
}));

const categories = pgTable("categories",{
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

}, (t) => [uniqueIndex("name_idx").on(t.name)])

export const categoriesRelations = relations(categories, ({many}) => ({
    videos: many(videos),
}));

const videoVisibility = pgEnum("visibility", [
    "private",
    "public"
]);

 const videos = pgTable("videos",{
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailKey: text("thumbnail_key"),
    previewUrl: text("preview_url"),
    previewKey: text("preview_key"),
    duration: integer("duration"),
    muxStatus: text("mux_status"),
    videoVisibility: videoVisibility('visibility').default("private").notNull(),
    muxAssetId: text("mux_asset_id").unique(),
    muxUploadId: text("mux_upload_id").unique(),
    muxPlaybakId: text("mux_playback_id").unique(),
    muxTrackId: text("mux_track_id").unique(),
    muxTrackStatus: text("mux_track_status"),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

});

export const videoInsertSchema = createInsertSchema(videos)
export const videoUpdateSchema = createUpdateSchema(videos)
export const videoSelectSchema = createSelectSchema(videos)


export const videoRelations = relations(videos, ({one, many}) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id],
    }),
    views: many(videosViews),
    reactions: many(videosReactions),
}));

const videosViews = pgTable("videos_views",{
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    videoId: uuid("video_id").references(() => videos.id, {
        onDelete: "cascade",
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

}, (t) => [primaryKey({
    name: "videos_views_pk",
    columns: [t.userId, t.videoId]
})
])

export const viewRelations = relations(videosViews, ({one}) => ({
    users: one(users, {
        fields: [videosViews.userId],
        references: [users.id],
    }),
    videos: one(videos, {
        fields: [videosViews.videoId],
        references: [videos.id],
    }),
}));

export const videoViewsInsertSchema = createInsertSchema(videosViews)
export const videoViewsUpdateSchema = createUpdateSchema(videosViews)
export const videoViewsSelectSchema = createSelectSchema(videosViews)



export const reactionType = pgEnum("reaction_type", [
    "like",
    "dislike"
]);

const videosReactions = pgTable("videos_reactions",{
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    videoId: uuid("video_id").references(() => videos.id, {
        onDelete: "cascade",
    }).notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

}, (t) => [primaryKey({
    name: "videos_reactios_pk",
    columns: [t.userId, t.videoId]
})
])


export const reactionRelations = relations(videosReactions, ({one}) => ({
    users: one(users, {
        fields: [videosReactions.userId],
        references: [users.id],
    }),
    videos: one(videos, {
        fields: [videosReactions.videoId],
        references: [videos.id],
    }),
}));

export const videoReactionsInsertSchema = createInsertSchema(videosReactions)
export const videoReactionsUpdateSchema = createUpdateSchema(videosReactions)
export const videoReactionsSelectSchema = createSelectSchema(videosReactions)


export { users, categories, videos, videoVisibility, videosViews, videosReactions };