import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { ConditionRating } from '../../types/enums';
import { Tool } from './Tool';
import { Site } from '../sites/Site';
import { User } from '../core/User';

@Entity({ name: 'tool_assignments' })
export class ToolAssignment {
  @PrimaryGeneratedColumn('uuid', { name: 'assignment_id' })
  assignmentId: string;

  @Column({ name: 'tool_id', type: 'uuid' })
  toolId: string;

  @Column({ name: 'site_id', type: 'uuid' })
  siteId: string;

  @Column({ name: 'assigned_by_user_id', type: 'uuid' })
  assignedByUserId: string;

  @Column({ name: 'assigned_to_user_id', type: 'uuid', nullable: true })
  assignedToUserId: string | null;

  @Column({ name: 'assignment_date', type: 'date' })
  assignmentDate: Date;

  @Column({ name: 'expected_return_date', type: 'date', nullable: true })
  expectedReturnDate: Date | null;

  @Column({ name: 'actual_return_date', type: 'date', nullable: true })
  actualReturnDate: Date | null;

  @Column({ name: 'assignment_notes', type: 'text', nullable: true })
  assignmentNotes: string | null;

  @Column({ name: 'return_condition', type: 'enum', enum: ConditionRating, nullable: true })
  returnCondition: ConditionRating | null;

  @Column({ name: 'return_notes', type: 'text', nullable: true })
  returnNotes: string | null;

  @Column({ name: 'damages_reported', type: 'text', nullable: true })
  damagesReported: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Tool, (tool) => tool.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tool_id' })
  tool: Tool;

  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by_user_id' })
  assignedBy: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to_user_id' })
  assignedTo: User | null;
}