import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Skill Builder: Store learner attempts and feedback
export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  moduleId: text("module_id").notNull(), // e.g., "project_stakeholders"
  attemptNumber: integer("attempt_number").notNull(),
  partNumber: integer("part_number").default(1).notNull(),
  userResponse: text("user_response").notNull(),
  score: integer("score").notNull(),
  feedback: text("feedback").notNull(),
  strengths: text("strengths").array().notNull(),
  improvements: text("improvements").array().notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertAttemptSchema = createInsertSchema(attempts).omit({
  id: true,
  createdAt: true,
});

export type Attempt = typeof attempts.$inferSelect;
export type InsertAttempt = z.infer<typeof insertAttemptSchema>;

// Gamified Challenge Badges
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey(), // e.g., "first_attempt", "perfect_score"
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Icon name from lucide-react
  color: text("color").notNull(), // Tailwind color class
  category: text("category").notNull(), // "milestone", "mastery", "challenge"
  requirement: text("requirement").notNull(), // Human-readable requirement
  points: integer("points").notNull().default(10),
});

export const insertBadgeSchema = createInsertSchema(badges);
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

// User earned badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  moduleId: text("module_id"), // Optional: which module triggered the badge
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

// Course Videos
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  videoUrl: text("video_url"),
  duration: text("duration").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  chapter: text("chapter").notNull(),
  orderIndex: integer("order_index").notNull(),
  transcriptKey: text("transcript_key"),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

// Re-export chat models from integration
export { conversations, messages, insertConversationSchema, insertMessageSchema } from "./models/chat";
export type { Conversation, InsertConversation, Message, InsertMessage } from "./models/chat";
