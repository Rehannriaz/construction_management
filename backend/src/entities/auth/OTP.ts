import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'otps' })
export class OTP {
  @PrimaryGeneratedColumn('uuid', { name: 'otp_id' })
  otpId: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'otp_code', type: 'varchar', length: 10 })
  otpCode: string;

  @Column({ name: 'purpose', type: 'varchar', length: 50 })
  purpose: string; // 'email_verification', 'password_reset', 'login'

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  @Column({ name: 'attempts', type: 'int', default: 0 })
  attempts: number;

  @Column({ name: 'max_attempts', type: 'int', default: 5 })
  maxAttempts: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}