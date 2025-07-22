import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Site } from '../sites/Site';
import { User } from '../core/User';
import { ReportPhoto } from './ReportPhoto';

@Entity({ name: 'weekly_reports' })
export class WeeklyReport {
  @PrimaryGeneratedColumn('uuid', { name: 'report_id' })
  reportId: string;

  @Column({ name: 'site_id', type: 'uuid' })
  siteId: string;

  @Column({ name: 'site_manager_id', type: 'uuid' })
  siteManagerId: string;

  @Column({ name: 'week_start_date', type: 'date' })
  weekStartDate: Date;

  @Column({ name: 'week_end_date', type: 'date' })
  weekEndDate: Date;

  @Column({ name: 'total_hours_worked', type: 'decimal', precision: 6, scale: 2, nullable: true })
  totalHoursWorked: number | null;

  @Column({ name: 'total_workers', type: 'integer', nullable: true })
  totalWorkers: number | null;

  @Column({ name: 'weather_summary', type: 'text', nullable: true })
  weatherSummary: string | null;

  @Column({ name: 'materials_used_summary', type: 'text', nullable: true })
  materialsUsedSummary: string | null;

  @Column({ name: 'work_completed_summary', type: 'text' })
  workCompletedSummary: string;

  @Column({ name: 'challenges_issues_summary', type: 'text', nullable: true })
  challengesIssuesSummary: string | null;

  @Column({ name: 'next_week_plan', type: 'text', nullable: true })
  nextWeekPlan: string | null;

  @Column({ name: 'sub_trades_summary', type: 'text', nullable: true })
  subTradesSummary: string | null;

  @Column({ name: 'materials_delivered_summary', type: 'text', nullable: true })
  materialsDeliveredSummary: string | null;

  @Column({ name: 'visitors_summary', type: 'text', nullable: true })
  visitorsSummary: string | null;

  @Column({ name: 'safety_summary', type: 'text', nullable: true })
  safetySummary: string | null;

  @Column({ name: 'quality_issues', type: 'text', nullable: true })
  qualityIssues: string | null;

  @Column({ name: 'client_feedback', type: 'text', nullable: true })
  clientFeedback: string | null;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string | null;

  @Column({ name: 'is_submitted', type: 'boolean', default: false })
  isSubmitted: boolean;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt: Date | null;

  @Column({ name: 'sent_to_client', type: 'boolean', default: false })
  sentToClient: boolean;

  @Column({ name: 'sent_to_client_at', type: 'timestamptz', nullable: true })
  sentToClientAt: Date | null;

  @Column({ name: 'approved_by_user_id', type: 'uuid', nullable: true })
  approvedByUserId: string | null;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_manager_id' })
  siteManager: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by_user_id' })
  approvedBy: User | null;

  @OneToMany(() => ReportPhoto, (photo) => photo.weeklyReport)
  photos: ReportPhoto[];
}