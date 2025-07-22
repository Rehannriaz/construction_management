import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { DeliveryRequestType, VehicleType, DeliveryStatus } from '../../types/enums';
import { Site } from '../sites/Site';
import { User } from '../core/User';

@Entity({ name: 'delivery_requests' })
export class DeliveryRequest {
  @PrimaryGeneratedColumn('uuid', { name: 'request_id' })
  requestId: string;

  @Column({ name: 'site_id', type: 'uuid' })
  siteId: string;

  @Column({ name: 'requested_by_user_id', type: 'uuid' })
  requestedByUserId: string;

  @Column({ name: 'request_type', type: 'enum', enum: DeliveryRequestType })
  requestType: DeliveryRequestType;

  @Column({ name: 'vehicle_type', type: 'enum', enum: VehicleType })
  vehicleType: VehicleType;

  @Column({ name: 'purpose', type: 'varchar', length: 255 })
  purpose: string;

  @Column({ name: 'requested_date', type: 'date' })
  requestedDate: Date;

  @Column({ name: 'requested_time', type: 'time', nullable: true })
  requestedTime: string | null;

  @Column({ name: 'estimated_duration_hours', type: 'decimal', precision: 3, scale: 1, nullable: true })
  estimatedDurationHours: number | null;

  @Column({ name: 'pickup_location', type: 'text', nullable: true })
  pickupLocation: string | null;

  @Column({ name: 'delivery_location', type: 'text', nullable: true })
  deliveryLocation: string | null;

  @Column({ name: 'special_instructions', type: 'text', nullable: true })
  specialInstructions: string | null;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 8, scale: 2, nullable: true })
  weightKg: number | null;

  @Column({ name: 'requires_crane', type: 'boolean', default: false })
  requiresCrane: boolean;

  @Column({ name: 'status', type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  @Column({ name: 'approved_by_user_id', type: 'uuid', nullable: true })
  approvedByUserId: string | null;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date | null;

  @Column({ name: 'scheduled_date', type: 'date', nullable: true })
  scheduledDate: Date | null;

  @Column({ name: 'scheduled_time', type: 'time', nullable: true })
  scheduledTime: string | null;

  @Column({ name: 'driver_user_id', type: 'uuid', nullable: true })
  driverUserId: string | null;

  @Column({ name: 'vehicle_registration', type: 'varchar', length: 20, nullable: true })
  vehicleRegistration: string | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'completion_notes', type: 'text', nullable: true })
  completionNotes: string | null;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string | null;

  @Column({ name: 'actual_cost', type: 'decimal', precision: 8, scale: 2, nullable: true })
  actualCost: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by_user_id' })
  requestedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by_user_id' })
  approvedBy: User | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_user_id' })
  driver: User | null;
}