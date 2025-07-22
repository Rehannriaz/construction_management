import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { OTP } from '../entities/auth/OTP';
import { User } from '../entities/core/User';
import { emailService } from './EmailService';

interface CreateOTPOptions {
  email: string;
  purpose: string;
  expiryMinutes?: number;
}

interface VerifyOTPOptions {
  email: string;
  otpCode: string;
  purpose: string;
}

export class OTPService {
  private otpRepository: Repository<OTP>;
  private userRepository: Repository<User>;

  constructor() {
    this.otpRepository = AppDataSource.getRepository(OTP);
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Generate a random 6-digit OTP code
   */
  private generateOTPCode(): string {
    // For development, use static OTP from environment
    const staticOTP = process.env.STATIC_OTP;
    if (staticOTP) {
      return staticOTP;
    }
    
    // Generate random 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and send OTP
   */
  async createOTP(options: CreateOTPOptions): Promise<OTP> {
    const { email, purpose, expiryMinutes = 10 } = options;

    // Invalidate any existing pending OTPs for this email and purpose
    await this.otpRepository
      .createQueryBuilder()
      .update(OTP)
      .set({ verifiedAt: new Date() })
      .where('email = :email', { email })
      .andWhere('purpose = :purpose', { purpose })
      .andWhere('verified_at IS NULL')
      .execute();

    // Generate new OTP
    const otpCode = this.generateOTPCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    const otp = this.otpRepository.create({
      email,
      purpose,
      otpCode,
      expiresAt,
      attempts: 0,
      maxAttempts: 5
    });

    const savedOTP = await this.otpRepository.save(otp);

    // Send email if enabled
    await this.sendOTPEmail(email, otpCode, purpose);

    return savedOTP;
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(options: VerifyOTPOptions): Promise<{ success: boolean; message: string; otp?: OTP }> {
    const { email, otpCode, purpose } = options;

    // Find the most recent pending OTP
    const otp = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.email = :email', { email })
      .andWhere('otp.purpose = :purpose', { purpose })
      .andWhere('otp.verified_at IS NULL')
      .orderBy('otp.created_at', 'DESC')
      .getOne();

    if (!otp) {
      return {
        success: false,
        message: 'No valid OTP found. Please request a new one.'
      };
    }

    // Check if OTP is expired
    if (otp.expiresAt < new Date()) {
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.'
      };
    }

    // Check if max attempts reached
    if (otp.attempts >= otp.maxAttempts) {
      return {
        success: false,
        message: 'Maximum verification attempts reached. Please request a new OTP.'
      };
    }

    // Increment attempts
    await this.otpRepository.update(otp.otpId, { 
      attempts: otp.attempts + 1 
    });

    // Verify OTP code
    if (otp.otpCode !== otpCode) {
      const remainingAttempts = otp.maxAttempts - (otp.attempts + 1);
      return {
        success: false,
        message: `Invalid OTP code. ${remainingAttempts} attempts remaining.`
      };
    }

    // Mark OTP as verified
    const verifiedOTP = await this.otpRepository.save({
      ...otp,
      verifiedAt: new Date()
    });

    return {
      success: true,
      message: 'OTP verified successfully.',
      otp: verifiedOTP
    };
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string, purpose: string): Promise<{ success: boolean; message: string }> {
    // Create new OTP
    await this.createOTP({
      email,
      purpose
    });

    return {
      success: true,
      message: 'OTP has been resent to your email address.'
    };
  }

  /**
   * Clean up expired OTPs (can be called periodically)
   */
  async cleanupExpiredOTPs(): Promise<number> {
    const result = await this.otpRepository
      .createQueryBuilder()
      .delete()
      .from(OTP)
      .where('expires_at < :now', { now: new Date() })
      .execute();

    return result.affected || 0;
  }

  /**
   * Send OTP via email using EmailService
   */
  private async sendOTPEmail(email: string, otpCode: string, purpose: string): Promise<void> {
    try {
      if (!emailService.isReady()) {
        console.log(`[OTP EMAIL] Service not ready - OTP for ${email}: ${otpCode}`);
        return;
      }

      await emailService.sendOTPEmail(email, otpCode, purpose as any);
      
      console.log(`[OTP EMAIL] Successfully sent OTP email to ${email}`);
    } catch (error) {
      console.error('[OTP EMAIL] Failed to send email:', error);
      // Don't throw error - OTP should still be created even if email fails
    }
  }
}

export const otpService = new OTPService();