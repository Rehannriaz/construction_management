import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Company } from '../entities/Company';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { Subscription } from '../entities/Subscription';
import { Site } from '../entities/Site';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Don't sync in production
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Company,
    User,
    RefreshToken,
    Subscription,
    Site
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
};