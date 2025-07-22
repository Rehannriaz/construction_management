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

@Entity({ name: 'daily_reports' })
export class DailyReport {
  @PrimaryGeneratedColumn('uuid', { name: 'report_id' })
  reportId: string;

  @Column({ name: 'site_id', type: 'uuid' })
  siteId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'report_date', type: 'date' })
  reportDate: Date;

  @Column({ name: 'hours_worked', type: 'decimal', precision: 4, scale: 2 })
  hoursWorked: number;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string | null;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string | null;

  @Column({ name: 'break_duration_minutes', type: 'integer', default: 0 })
  breakDurationMinutes: number;

  @Column({ name: 'weather_conditions', type: 'varchar', length: 255, nullable: true })
  weatherConditions: string | null;

  @Column({ name: 'temperature_celsius', type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperatureCelsius: number | null;

  @Column({ name: 'materials_used', type: 'text', nullable: true })
  materialsUsed: string | null;

  @Column({ name: 'work_completed', type: 'text' })
  workCompleted: string;

  @Column({ name: 'challenges_issues', type: 'text', nullable: true })
  challengesIssues: string | null;

  @Column({ name: 'next_day_plan', type: 'text', nullable: true })
  nextDayPlan: string | null;

  @Column({ name: 'sub_trades_on_site', type: 'text', nullable: true })
  subTradesOnSite: string | null;

  @Column({ name: 'materials_delivered', type: 'text', nullable: true })
  materialsDelivered: string | null;

  @Column({ name: 'visitors_to_site', type: 'text', nullable: true })
  visitorsToSite: string | null;

  @Column({ name: 'safety_observations', type: 'text', nullable: true })
  safetyObservations: string | null;

  @Column({ name: 'is_submitted', type: 'boolean', default: false })
  isSubmitted: boolean;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt: Date | null;

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
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by_user_id' })
  approvedBy: User | null;

  @OneToMany(() => ReportPhoto, (photo) => photo.dailyReport)
  photos: ReportPhoto[];
}