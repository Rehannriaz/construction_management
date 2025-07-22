import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { SubscriptionTier } from "../../types/enums";
import { User } from "./User";
import { Subscription } from "./Subscription";
import { Site } from "../sites/Site";

@Entity({ schema: "core", name: "companies" })
export class Company {
  @PrimaryGeneratedColumn("uuid", { name: "company_id" })
  companyId: string;

  @Column({ name: "company_name", type: "varchar", length: 255 })
  companyName: string;

  @Column({ name: "company_email", type: "varchar", length: 255, unique: true })
  companyEmail: string;

  @Column({
    name: "company_phone",
    type: "varchar",
    length: 20,
    nullable: true,
  })
  companyPhone: string | null;

  @Column({ name: "company_address", type: "text", nullable: true })
  companyAddress: string | null;

  @Column({ name: "company_abn", type: "varchar", length: 20, nullable: true })
  companyAbn: string | null;

  @Column({ name: "company_logo_url", type: "text", nullable: true })
  companyLogoUrl: string | null;

  @Column({
    name: "subscription_tier",
    type: "enum",
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
  })
  subscriptionTier: SubscriptionTier;

  @Column({
    name: "billing_email",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  billingEmail: string | null;

  @Column({
    name: "timezone",
    type: "varchar",
    length: 50,
    default: "Australia/Sydney",
  })
  timezone: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  @Column({ name: "trial_ends_at", type: "timestamptz", nullable: true })
  trialEndsAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Site, (site) => site.company)
  sites: Site[];

  @OneToMany(() => Subscription, (subscription) => subscription.company)
  subscriptions: Subscription[];
}
