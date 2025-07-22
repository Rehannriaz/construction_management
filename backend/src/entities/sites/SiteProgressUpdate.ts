import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { WeatherDelayReason, MilestoneType } from '../../types/enums';
import { Site } from './Site';
import { User } from '../core/User';

@Entity({ name: 'site_progress_updates' })
export class SiteProgressUpdate {
  @PrimaryGeneratedColumn('uuid', { name: 'update_id' })
  updateId: string;

  @Column({ name: 'site_id', type: 'uuid' })
  siteId: string;

  @Column({ name: 'updated_by_user_id', type: 'uuid' })
  updatedByUserId: string;

  @Column({ name: 'progress_percentage', type: 'decimal', precision: 5, scale: 2 })
  progressPercentage: number;

  @Column({ name: 'milestone_description', type: 'varchar', length: 255, nullable: true })
  milestoneDescription: string | null;

  @Column({ name: 'estimated_completion_date', type: 'date', nullable: true })
  estimatedCompletionDate: Date | null;

  @Column({ name: 'days_lost_weather', type: 'smallint', default: 0 })
  daysLostWeather: number;

  @Column({ name: 'weather_delay_reason', type: 'enum', enum: WeatherDelayReason, nullable: true })
  weatherDelayReason: WeatherDelayReason | null;

  @Column({ name: 'days_lost_other', type: 'smallint', default: 0 })
  daysLostOther: number;

  @Column({ name: 'other_delay_reason', type: 'text', nullable: true })
  otherDelayReason: string | null;

  @Column({ name: 'reason_for_delays', type: 'text', nullable: true })
  reasonForDelays: string | null;

  @Column({ name: 'update_notes', type: 'text', nullable: true })
  updateNotes: string | null;

  @Column({ name: 'cost_impact', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costImpact: number | null;

  @Column({ name: 'schedule_impact_days', type: 'integer', nullable: true })
  scheduleImpactDays: number | null;

  @Column({ name: 'mitigation_actions', type: 'text', nullable: true })
  mitigationActions: string | null;

  @Column({ name: 'is_milestone', type: 'boolean', default: false })
  isMilestone: boolean;

  @Column({ name: 'milestone_type', type: 'enum', enum: MilestoneType, nullable: true })
  milestoneType: MilestoneType | null;

  @Column({ name: 'milestone_date', type: 'date', nullable: true })
  milestoneDate: Date | null;

  @Column({ name: 'update_date', type: 'date', default: () => 'CURRENT_DATE' })
  updateDate: Date;

  @Column({ name: 'photos_attached', type: 'integer', default: 0 })
  photosAttached: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: User;
}