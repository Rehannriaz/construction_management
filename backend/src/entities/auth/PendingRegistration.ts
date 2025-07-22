import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'pending_registrations' })
export class PendingRegistration {
  @PrimaryGeneratedColumn('uuid', { name: 'registration_id' })
  registrationId: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
  companyName: string | null;

  @Column({ name: 'company_email', type: 'varchar', length: 255, nullable: true })
  companyEmail: string | null;

  @Column({ name: 'company_phone', type: 'varchar', length: 20, nullable: true })
  companyPhone: string | null;

  @Column({ name: 'company_abn', type: 'varchar', length: 20, nullable: true })
  companyAbn: string | null;

  @Column({ name: 'verification_token', type: 'varchar', length: 255, unique: true })
  verificationToken: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}