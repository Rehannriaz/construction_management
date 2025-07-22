import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Import all entities from organized modules
import * as AuthEntities from "../entities/auth";
import * as CoreEntities from "../entities/core";
import * as SiteEntities from "../entities/sites";
import * as ReportEntities from "../entities/reports";
import * as DocumentEntities from "../entities/documents";
import * as MessagingEntities from "../entities/messaging";
import * as TrackingEntities from "../entities/tracking";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Disabled - using pre-existing database schema
  logging: process.env.NODE_ENV === "development",
  entities: [
    ...Object.values(AuthEntities),
    ...Object.values(CoreEntities),
    ...Object.values(SiteEntities),
    ...Object.values(ReportEntities),
    ...Object.values(DocumentEntities),
    ...Object.values(MessagingEntities),
    ...Object.values(TrackingEntities),
  ],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
});

// Drop dependent views before sync
const dropDependentViews = async (): Promise<void> => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    
    // Drop the dependent views mentioned in the error
    await queryRunner.query('DROP VIEW IF EXISTS reporting.active_site_assignments CASCADE');
    await queryRunner.query('DROP VIEW IF EXISTS reporting.overdue_reports CASCADE');
    
    console.log("✅ Dependent views dropped successfully");
    await queryRunner.release();
  } catch (error: any) {
    console.warn("⚠️ Warning dropping views (may not exist):", error.message);
  }
};

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    
    // Drop dependent views before sync if in development
    if (process.env.NODE_ENV === "development") {
      await dropDependentViews();
    }
    
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Error during database initialization:", error);
    process.exit(1);
  }
};
