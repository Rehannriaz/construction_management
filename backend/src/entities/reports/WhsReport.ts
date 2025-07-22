import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { SafetyRating } from '../../types/enums';
import { Site } from '../sites/Site';
import { User } from '../core/User';

@Entity({ name: 'whs_reports' })
export class WhsReport {
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

  @Column({ name: 'safety_incidents', type: 'text', nullable: true })
  safetyIncidents: string | null;

  @Column({ name: 'incident_count', type: 'integer', default: 0 })
  incidentCount: number;

  @Column({ name: 'near_miss_count', type: 'integer', default: 0 })
  nearMissCount: number;

  @Column({ name: 'safety_meetings_held', type: 'text', nullable: true })
  safetyMeetingsHeld: string | null;

  @Column({ name: 'meeting_attendance_count', type: 'integer', nullable: true })
  meetingAttendanceCount: number | null;

  @Column({ name: 'ppe_compliance_check', type: 'text', nullable: true })
  ppeComplianceCheck: string | null;

  @Column({ name: 'ppe_compliance_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  ppeCompliancePercentage: number | null;

  @Column({ name: 'site_hazards_identified', type: 'text', nullable: true })
  siteHazardsIdentified: string | null;

  @Column({ name: 'hazards_resolved_count', type: 'integer', default: 0 })
  hazardsResolvedCount: number;

  @Column({ name: 'corrective_actions_taken', type: 'text', nullable: true })
  correctiveActionsTaken: string | null;

  @Column({ name: 'safety_training_conducted', type: 'text', nullable: true })
  safetyTrainingConducted: string | null;

  @Column({ name: 'training_hours_delivered', type: 'decimal', precision: 5, scale: 2, default: 0 })
  trainingHoursDelivered: number;

  @Column({ name: 'emergency_procedures_reviewed', type: 'boolean', default: false })
  emergencyProceduresReviewed: boolean;

  @Column({ name: 'first_aid_incidents', type: 'text', nullable: true })
  firstAidIncidents: string | null;

  @Column({ name: 'first_aid_incident_count', type: 'integer', default: 0 })
  firstAidIncidentCount: number;

  @Column({ name: 'near_miss_reports', type: 'text', nullable: true })
  nearMissReports: string | null;

  @Column({ name: 'overall_safety_rating', type: 'enum', enum: SafetyRating })
  overallSafetyRating: SafetyRating;

  @Column({ name: 'recommendations', type: 'text', nullable: true })
  recommendations: string | null;

  @Column({ name: 'regulatory_compliance_notes', type: 'text', nullable: true })
  regulatoryComplianceNotes: string | null;

  @Column({ name: 'is_submitted', type: 'boolean', default: false })
  isSubmitted: boolean;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt: Date | null;

  @Column({ name: 'reviewed_by_user_id', type: 'uuid', nullable: true })
  reviewedByUserId: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

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
  @JoinColumn({ name: 'reviewed_by_user_id' })
  reviewedBy: User | null;
}