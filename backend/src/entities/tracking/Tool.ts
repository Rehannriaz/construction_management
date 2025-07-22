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
import { ToolType, ConditionRating } from '../../types/enums';
import { Company } from '../core/Company';
import { ToolAssignment } from './ToolAssignment';

@Entity({ name: 'tools' })
export class Tool {
  @PrimaryGeneratedColumn('uuid', { name: 'tool_id' })
  toolId: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'tool_name', type: 'varchar', length: 255 })
  toolName: string;

  @Column({ name: 'tool_type', type: 'enum', enum: ToolType })
  toolType: ToolType;

  @Column({ name: 'tool_code', type: 'varchar', length: 100, nullable: true })
  toolCode: string | null;

  @Column({ name: 'serial_number', type: 'varchar', length: 255, nullable: true })
  serialNumber: string | null;

  @Column({ name: 'manufacturer', type: 'varchar', length: 255, nullable: true })
  manufacturer: string | null;

  @Column({ name: 'model', type: 'varchar', length: 255, nullable: true })
  model: string | null;

  @Column({ name: 'purchase_date', type: 'date', nullable: true })
  purchaseDate: Date | null;

  @Column({ name: 'purchase_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchaseValue: number | null;

  @Column({ 
    name: 'current_condition', 
    type: 'enum', 
    enum: ConditionRating, 
    default: ConditionRating.GOOD 
  })
  currentCondition: ConditionRating;

  @Column({ name: 'last_service_date', type: 'date', nullable: true })
  lastServiceDate: Date | null;

  @Column({ name: 'next_service_date', type: 'date', nullable: true })
  nextServiceDate: Date | null;

  @Column({ name: 'maintenance_due_date', type: 'date', nullable: true })
  maintenanceDueDate: Date | null;

  @Column({ name: 'insurance_expiry_date', type: 'date', nullable: true })
  insuranceExpiryDate: Date | null;

  @Column({ name: 'registration_number', type: 'varchar', length: 100, nullable: true })
  registrationNumber: string | null;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'operating_instructions', type: 'text', nullable: true })
  operatingInstructions: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ToolAssignment, (assignment) => assignment.tool)
  assignments: ToolAssignment[];
}