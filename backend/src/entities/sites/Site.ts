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
import { SiteStatus } from '../../types/enums';
import { Company } from '../core/Company';
import { User } from '../core/User';
import { ClientAssignment } from './ClientAssignment';
import { SiteAssignment } from './SiteAssignment';

@Entity({ name: 'sites' })
export class Site {
  @PrimaryGeneratedColumn('uuid', { name: 'site_id' })
  siteId: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'site_name', type: 'varchar', length: 255 })
  siteName: string;

  @Column({ name: 'site_code', type: 'varchar', length: 50, nullable: true })
  siteCode: string;

  @Column({ name: 'site_address', type: 'text' })
  siteAddress: string;

  @Column({ name: 'site_description', type: 'text', nullable: true })
  siteDescription: string;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'estimated_completion_date', type: 'date', nullable: true })
  estimatedCompletionDate: Date;

  @Column({ name: 'actual_completion_date', type: 'date', nullable: true })
  actualCompletionDate: Date;

  @Column({ 
    name: 'site_status', 
    type: 'enum', 
    enum: SiteStatus, 
    default: SiteStatus.PLANNING 
  })
  siteStatus: SiteStatus;

  @Column({ name: 'site_value', type: 'decimal', precision: 15, scale: 2, nullable: true })
  siteValue: number;

  @Column({ name: 'contract_number', type: 'varchar', length: 100, nullable: true })
  contractNumber: string;

  @Column({ name: 'emergency_contact_name', type: 'varchar', length: 255, nullable: true })
  emergencyContactName: string;

  @Column({ name: 'emergency_contact_phone', type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string;

  @Column({ name: 'meeting_point_coordinates', type: 'varchar', length: 100, nullable: true })
  meetingPointCoordinates: string;

  @Column({ name: 'site_manager_id', type: 'uuid', nullable: true })
  siteManagerId: string;

  @Column({ name: 'safety_officer_id', type: 'uuid', nullable: true })
  safetyOfficerId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, (company) => company.sites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'site_manager_id' })
  siteManager: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'safety_officer_id' })
  safetyOfficer: User;

  // One-to-Many Relations
  @OneToMany(() => ClientAssignment, (clientAssignment) => clientAssignment.site)
  clientAssignments: ClientAssignment[];

  @OneToMany(() => SiteAssignment, (siteAssignment) => siteAssignment.site)
  siteAssignments: SiteAssignment[];
}