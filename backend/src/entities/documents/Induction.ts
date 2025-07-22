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
import { InductionType } from '../../types/enums';
import { Company } from '../core/Company';
import { Site } from '../sites/Site';
import { User } from '../core/User';
import { UserInduction } from './UserInduction';

@Entity({ name: 'inductions' })
export class Induction {
  @PrimaryGeneratedColumn('uuid', { name: 'induction_id' })
  inductionId: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'site_id', type: 'uuid', nullable: true })
  siteId: string | null;

  @Column({ name: 'induction_name', type: 'varchar', length: 255 })
  inductionName: string;

  @Column({ name: 'induction_type', type: 'enum', enum: InductionType })
  inductionType: InductionType;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'content_url', type: 'text', nullable: true })
  contentUrl: string | null;

  @Column({ name: 'duration_minutes', type: 'integer', nullable: true })
  durationMinutes: number | null;

  @Column({ name: 'is_mandatory', type: 'boolean', default: true })
  isMandatory: boolean;

  @Column({ name: 'requires_renewal', type: 'boolean', default: false })
  requiresRenewal: boolean;

  @Column({ name: 'renewal_period_days', type: 'integer', nullable: true })
  renewalPeriodDays: number | null;

  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

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

  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @OneToMany(() => UserInduction, (userInduction) => userInduction.induction)
  userInductions: UserInduction[];
}