import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { ReportType } from '../../types/enums';
import { User } from '../core/User';
import { Site } from '../sites/Site';

@Entity({ name: 'report_photos' })
export class ReportPhoto {
  @PrimaryGeneratedColumn('uuid', { name: 'photo_id' })
  photoId: string;

  @Column({ name: 'report_type', type: 'enum', enum: ReportType })
  reportType: ReportType;

  @Column({ name: 'report_id', type: 'uuid' })
  reportId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'site_id', type: 'uuid' })
  siteId: string;

  @Column({ name: 'photo_url', type: 'text' })
  photoUrl: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'photo_filename', type: 'varchar', length: 255 })
  photoFilename: string;

  @Column({ name: 'photo_description', type: 'varchar', length: 500, nullable: true })
  photoDescription: string | null;

  @Column({ name: 'file_size_bytes', type: 'bigint', nullable: true })
  fileSizeBytes: number | null;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: true })
  mimeType: string | null;

  @Column({ name: 'upload_order', type: 'smallint', nullable: true })
  uploadOrder: number | null;

  @Column({ name: 'gps_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  gpsLatitude: number | null;

  @Column({ name: 'gps_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  gpsLongitude: number | null;

  @Column({ name: 'taken_at', type: 'timestamptz', nullable: true })
  takenAt: Date | null;

  @Column({ name: 'uploaded_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Column({ name: 'is_approved', type: 'boolean', default: true })
  isApproved: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  // Note: Polymorphic relationships - these will be set based on report_type
  dailyReport?: any;
  weeklyReport?: any;
  whsReport?: any;
}