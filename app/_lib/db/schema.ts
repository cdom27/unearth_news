import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  jsonb,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "summarized",
  "analyzed",
  "claims_extracted",
  "claims_verified",
  "completed",
]);

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  slug: text("slug"),
  bias: varchar("bias", { length: 50 }).notNull().default("center"),
  factualReporting: varchar("factual_reporting", { length: 50 }),
  country: varchar("country", { length: 100 }),
  mediaType: varchar("media_type", { length: 50 }),
  credibility: varchar("credibility", { length: 50 }),
});

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  language: text("language").notNull(),
  byline: text("byline").notNull(),
  excerpt: text("excerpt").notNull(),
  textContent: text("text_content").notNull(),
  keywords: text("keywords"),
  publishedTime: timestamp("published_time", { withTimezone: true })
    .notNull()
    .defaultNow(),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const analyses = pgTable("analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id")
    .notNull()
    .unique()
    .references(() => articles.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  summary: jsonb("summary"),
  sentiment: text("sentiment"),
  framing: jsonb("framing"),
  claims: jsonb("claims"),
  meta: jsonb("meta").notNull(),
  factualScore: doublePrecision("factual_score"),
  biasScore: doublePrecision("bias_score"),
  status: statusEnum("status").notNull().default("summarized"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
