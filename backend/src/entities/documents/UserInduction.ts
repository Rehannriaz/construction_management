import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { InductionStatus } from '../../types/enums';
import { User } from '../core/User';
import { Induction } from './Induction';
import { Site } from '../sites/Site';

@Entity({ name: 'user_inductions' })
export class UserInduction {
  @PrimaryGeneratedColumn('uuid', { name: 'completion_id' })
  completionId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'induction_id', type: 'uuid' })
  inductionId: string;

  @Column({ name: 'site_id', type: 'uuid', nullable: true })
  siteId: string | null;

  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: InductionStatus, 
    default: InductionStatus.NOT_STARTED 
  })
  status: InductionStatus;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number | null;

  @Column({ name: 'certificate_url', type: 'text', nullable: true })
  certificateUrl: string | null;

  @Column({ name: 'supervisor_user_id', type: 'uuid', nullable: true })
  supervisorUserId: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Induction, (induction) => induction.userInductions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'induction_id' })
  induction: Induction;

  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'supervisor_user_id' })
  supervisor: User | null;
}