import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne,
  CreateDateColumn, 
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { SubscriptionStatus } from '../../types/enums';
import { Company } from './Company';

@Entity({ schema: 'core', name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid', { name: 'subscription_id' })
  subscriptionId: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'stripe_subscription_id', type: 'varchar', length: 255, nullable: true })
  stripeSubscriptionId: string;

  @Column({ name: 'stripe_customer_id', type: 'varchar', length: 255, nullable: true })
  stripeCustomerId: string;

  @Column({ name: 'plan_name', type: 'varchar', length: 100 })
  planName: string;

  @Column({ name: 'billing_interval', type: 'varchar', length: 20, default: 'monthly' })
  billingInterval: string;

  @Column({ name: 'amount_cents', type: 'int', nullable: true })
  amountCents: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'AUD' })
  currency: string;

  @Column({ name: 'status', type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Column({ name: 'current_period_start', type: 'timestamptz', nullable: true })
  currentPeriodStart: Date;

  @Column({ name: 'current_period_end', type: 'timestamptz', nullable: true })
  currentPeriodEnd: Date;

  @Column({ name: 'trial_start', type: 'timestamptz', nullable: true })
  trialStart: Date;

  @Column({ name: 'trial_end', type: 'timestamptz', nullable: true })
  trialEnd: Date;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, (company) => company.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}