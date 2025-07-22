import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { LeaveType, RequestStatus } from '../../types/enums';
import { User } from '../core/User';

@Entity({ name: 'leave_requests' })
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid', { name: 'request_id' })
  requestId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'requested_by_user_id', type: 'uuid' })
  requestedByUserId: string;

  @Column({ name: 'leave_type', type: 'enum', enum: LeaveType })
  leaveType: LeaveType;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'total_days', type: 'smallint' })
  totalDays: number;

  @Column({ name: 'total_hours', type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalHours: number | null;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason: string | null;

  @Column({ name: 'supporting_document_url', type: 'text', nullable: true })
  supportingDocumentUrl: string | null;

  @Column({ name: 'status', type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ name: 'reviewed_by_user_id', type: 'uuid', nullable: true })
  reviewedByUserId: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string | null;

  @Column({ name: 'approval_notes', type: 'text', nullable: true })
  approvalNotes: string | null;

  @Column({ name: 'affects_sites', type: 'uuid', array: true, nullable: true })
  affectsSites: string[] | null;

  @Column({ name: 'replacement_worker_id', type: 'uuid', nullable: true })
  replacementWorkerId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by_user_id' })
  requestedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_by_user_id' })
  reviewedBy: User | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'replacement_worker_id' })
  replacementWorker: User | null;
}