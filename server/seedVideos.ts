import { db } from "./db";
import { videos } from "@shared/schema";
import { eq } from "drizzle-orm";

const VIDEO_DATA = [
  { title: "Empower your organization", videoUrl: "/videos/NIST/5233273_en_US_00_01_empower_VT.mp4", duration: "42s", durationSeconds: 42, chapter: "Introduction", orderIndex: 1, transcriptKey: "Empower your organization" },
  { title: "Core functions of the NIST Cybersecurity Framework (CSF)", videoUrl: "/videos/NIST/5233273_en_US_01_01_function_VT.mp4", duration: "2m 50s", durationSeconds: 170, chapter: "1. Intro to NIST CSF 2.1", orderIndex: 2, transcriptKey: "Core functions of the NIST Cybersecurity Framework (CSF)" },
  { title: "Key framework updates", videoUrl: "/videos/NIST/5233273_en_US_01_02_update_VT.mp4", duration: "2m 23s", durationSeconds: 143, chapter: "1. Intro to NIST CSF 2.1", orderIndex: 3, transcriptKey: "Key framework updates" },
  { title: "Asset management", videoUrl: "/videos/NIST/5233273_en_US_02_01_asset_VT.mp4", duration: "3m 43s", durationSeconds: 223, chapter: "2. Deep Dive into Identify", orderIndex: 4, transcriptKey: "Asset management" },
  { title: "Risk assessment and risk strategy", videoUrl: "/videos/NIST/5233273_en_US_02_02_data_VT.mp4", duration: "3m 38s", durationSeconds: 218, chapter: "2. Deep Dive into Identify", orderIndex: 5, transcriptKey: "Risk assessment and risk strategy" },
  { title: "Governance and risk management", videoUrl: "/videos/NIST/5233273_en_US_02_03_govern_VT.mp4", duration: "3m 16s", durationSeconds: 196, chapter: "2. Deep Dive into Identify", orderIndex: 6, transcriptKey: "Governance and risk management" },
  { title: "Identity and access management", videoUrl: "/videos/NIST/5233273_en_US_03_01_access_VT.mp4", duration: "4m 25s", durationSeconds: 265, chapter: "3. Strengthening the Protect Function", orderIndex: 7, transcriptKey: "Identity and access management" },
  { title: "Data security", videoUrl: "/videos/NIST/5233273_en_US_03_02_data_VT.mp4", duration: "2m 48s", durationSeconds: 168, chapter: "3. Strengthening the Protect Function", orderIndex: 8, transcriptKey: "Data security" },
  { title: "Security awareness and culture", videoUrl: "/videos/NIST/5233273_en_US_03_03_training_VT.mp4", duration: "2m 19s", durationSeconds: 139, chapter: "3. Strengthening the Protect Function", orderIndex: 9, transcriptKey: "Security awareness and culture" },
  { title: "Protective tech", videoUrl: "/videos/NIST/5233273_en_US_03_04_tech_VT.mp4", duration: "3m 45s", durationSeconds: 225, chapter: "3. Strengthening the Protect Function", orderIndex: 10, transcriptKey: "Protective tech" },
  { title: "Detecting threats and anomalies", videoUrl: "/videos/NIST/5233273_en_US_04_01_threat_VT.mp4", duration: "3m 7s", durationSeconds: 187, chapter: "4. Detect, Respond, and Recover Functions", orderIndex: 11, transcriptKey: "Detecting threats and anomalies" },
  { title: "Incident response", videoUrl: "/videos/NIST/5233273_en_US_04_02_respond_VT.mp4", duration: "2m 54s", durationSeconds: 174, chapter: "4. Detect, Respond, and Recover Functions", orderIndex: 12, transcriptKey: "Incident response" },
  { title: "Recovery from incidents", videoUrl: "/videos/NIST/5233273_en_US_04_03_recover_VT.mp4", duration: "2m 48s", durationSeconds: 168, chapter: "4. Detect, Respond, and Recover Functions", orderIndex: 13, transcriptKey: "Recovery from incidents" },
  { title: "Customizing for your organization", videoUrl: "/videos/NIST/5233273_en_US_05_01_custom_VT.mp4", duration: "2m 33s", durationSeconds: 153, chapter: "5. Implementing the Framework", orderIndex: 14, transcriptKey: "Customizing for your organization" },
  { title: "Measuring success and sustaining efforts", videoUrl: "/videos/NIST/5233273_en_US_05_02_measure_VT.mp4", duration: "1m 56s", durationSeconds: 116, chapter: "5. Implementing the Framework", orderIndex: 15, transcriptKey: "Measuring success and sustaining efforts" },
  { title: "Cybersecurity is a continuous journey", videoUrl: "/videos/NIST/5233273_en_US_06_01_next_VT.mp4", duration: "1m 14s", durationSeconds: 74, chapter: "Conclusion", orderIndex: 16, transcriptKey: "Cybersecurity is a continuous journey" },
];

export async function seedVideos() {
  console.log("Seeding videos...");
  
  for (const videoData of VIDEO_DATA) {
    const [existing] = await db.select().from(videos).where(eq(videos.title, videoData.title));
    
    if (!existing) {
      await db.insert(videos).values({
        title: videoData.title,
        videoUrl: videoData.videoUrl,
        duration: videoData.duration,
        durationSeconds: videoData.durationSeconds,
        chapter: videoData.chapter,
        orderIndex: videoData.orderIndex,
        transcriptKey: videoData.transcriptKey,
      });
      console.log(`Added: ${videoData.title}`);
    } else if (videoData.videoUrl && existing.videoUrl !== videoData.videoUrl) {
      await db.update(videos).set({ videoUrl: videoData.videoUrl }).where(eq(videos.id, existing.id));
      console.log(`Updated URL: ${videoData.title}`);
    } else {
      console.log(`Exists: ${videoData.title}`);
    }
  }
  
  console.log("Videos seeded successfully!");
}
