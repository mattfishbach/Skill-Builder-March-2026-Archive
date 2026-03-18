import { db } from "./db";
import { type User, type InsertUser, type Attempt, type InsertAttempt, type Badge, type InsertBadge, type UserBadge, type InsertUserBadge, type Video, type InsertVideo, users, attempts, badges, userBadges, videos } from "@shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Skill Builder methods
  createAttempt(attempt: InsertAttempt): Promise<Attempt>;
  getAttemptsBySession(sessionId: string, moduleId: string): Promise<Attempt[]>;
  getLatestAttempt(sessionId: string, moduleId: string): Promise<Attempt | undefined>;
  
  // Badge methods
  getAllBadges(): Promise<Badge[]>;
  getBadge(id: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getUserBadges(sessionId: string): Promise<(UserBadge & { badge: Badge })[]>;
  hasUserBadge(sessionId: string, badgeId: string): Promise<boolean>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  getAllAttemptsBySession(sessionId: string): Promise<Attempt[]>;
  
  // Video methods
  getAllVideos(): Promise<Video[]>;
  getVideoByTitle(title: string): Promise<Video | undefined>;
  getVideoById(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoUrl(id: number, videoUrl: string): Promise<Video | undefined>;
}

class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createAttempt(attempt: InsertAttempt): Promise<Attempt> {
    const [newAttempt] = await db.insert(attempts).values(attempt).returning();
    return newAttempt;
  }

  async getAttemptsBySession(sessionId: string, moduleId: string): Promise<Attempt[]> {
    return db
      .select()
      .from(attempts)
      .where(and(eq(attempts.sessionId, sessionId), eq(attempts.moduleId, moduleId)))
      .orderBy(attempts.attemptNumber);
  }

  async getLatestAttempt(sessionId: string, moduleId: string): Promise<Attempt | undefined> {
    const [attempt] = await db
      .select()
      .from(attempts)
      .where(and(eq(attempts.sessionId, sessionId), eq(attempts.moduleId, moduleId)))
      .orderBy(desc(attempts.attemptNumber))
      .limit(1);
    return attempt;
  }

  async getAllBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }

  async getBadge(id: string): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db.insert(badges).values(badge).returning();
    return newBadge;
  }

  async getUserBadges(sessionId: string): Promise<(UserBadge & { badge: Badge })[]> {
    const results = await db
      .select()
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.sessionId, sessionId))
      .orderBy(desc(userBadges.earnedAt));
    
    return results.map(r => ({
      ...r.user_badges,
      badge: r.badges,
    }));
  }

  async hasUserBadge(sessionId: string, badgeId: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(userBadges)
      .where(and(eq(userBadges.sessionId, sessionId), eq(userBadges.badgeId, badgeId)))
      .limit(1);
    return !!existing;
  }

  async awardBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    // Check if badge already awarded to prevent duplicates
    const alreadyHas = await this.hasUserBadge(userBadge.sessionId, userBadge.badgeId);
    if (alreadyHas) {
      const existing = await db
        .select()
        .from(userBadges)
        .where(and(eq(userBadges.sessionId, userBadge.sessionId), eq(userBadges.badgeId, userBadge.badgeId)))
        .limit(1);
      return existing[0];
    }
    const [newUserBadge] = await db.insert(userBadges).values(userBadge).returning();
    return newUserBadge;
  }

  async getAllAttemptsBySession(sessionId: string): Promise<Attempt[]> {
    return db
      .select()
      .from(attempts)
      .where(eq(attempts.sessionId, sessionId))
      .orderBy(desc(attempts.createdAt));
  }

  async getAllVideos(): Promise<Video[]> {
    return db.select().from(videos).orderBy(asc(videos.orderIndex));
  }

  async getVideoByTitle(title: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.title, title));
    return video;
  }

  async getVideoById(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async updateVideoUrl(id: number, videoUrl: string): Promise<Video | undefined> {
    const [updated] = await db.update(videos).set({ videoUrl }).where(eq(videos.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
