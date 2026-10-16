import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const galleries = pgTable("galleries", {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    coverPhotoId: integer("cover_photo_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(false),

});

export const photos = pgTable("photos", {
    id: serial("id").primaryKey(),
    galleryId: integer("gallery_id")
        .notNull()
        .references(() => galleries.id, { onDelete: "cascade" }),
    r2Key: text("r2_key").notNull(),
    alt: text("alt").notNull().default(""),
    caption: text("caption"),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),  
});

export const settings = pgTable("settings", {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
});

