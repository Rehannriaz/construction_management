import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/core/User';
import { Company } from '../entities/core/Company';
import { RefreshToken } from '../entities/auth/RefreshToken';
import { PendingRegistration } from '../entities/auth/PendingRegistration';
import { AuthUtils, JWTPayload, TokenPair } from '../utils/auth';
import { SignUpRequest, SignInRequest, AuthResponse, RefreshTokenRequest } from '../types/auth';
import { UserRole, SubscriptionTier } from '../types/enums';
import { v4 as uuidv4 } from 'uuid';
import { otpService } from './OTPService';
import { emailService } from './EmailService';

export class AuthService {
  private userRepository: Repository<User>;
  private companyRepository: Repository<Company>;
  private refreshTokenRepository: Repository<RefreshToken>;
  private pendingRegistrationRepository: Repository<PendingRegistration>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    this.pendingRegistrationRepository = AppDataSource.getRepository(PendingRegistration);
  }

  async signUp(signUpData: SignUpRequest, ipAddress?: string, userAgent?: string): Promise<{ message: string; email: string; requiresOTP: boolean }> {
    // Validate password strength
    const passwordValidation = AuthUtils.validatePassword(signUpData.password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Validate email format
    if (!AuthUtils.validateEmail(signUpData.email)) {
      throw new Error('Invalid email format');
    }

    if (!AuthUtils.validateEmail(signUpData.companyEmail)) {
      throw new Error('Invalid company email format');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: signUpData.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Check if company already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { companyEmail: signUpData.companyEmail }
    });

    if (existingCompany) {
      throw new Error('Company already exists with this email');
    }

    // Check if pending registration exists
    const existingPending = await this.pendingRegistrationRepository.findOne({
      where: { email: signUpData.email }
    });

    if (existingPending) {
      // Delete existing pending registration
      await this.pendingRegistrationRepository.remove(existingPending);
    }

    // Hash password
    const passwordHash = await AuthUtils.hashPassword(signUpData.password);

    // Create pending registration
    const verificationToken = uuidv4();
    const pendingRegistration = this.pendingRegistrationRepository.create({
      email: signUpData.email,
      passwordHash,
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      phone: signUpData.phone || null,
      companyName: signUpData.companyName,
      companyEmail: signUpData.companyEmail,
      companyPhone: signUpData.companyPhone || null,
      companyAbn: signUpData.companyAbn || null,
      verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    await this.pendingRegistrationRepository.save(pendingRegistration);

    // Generate and send OTP for email verification
    await otpService.createOTP({
      email: signUpData.email,
      purpose: 'email_verification'
    });

    return {
      message: 'Registration initiated. Please check your email for verification code.',
      email: signUpData.email,
      requiresOTP: true
    };
  }

  async verifyOTPAndCompleteSignup(email: string, otpCode: string, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // Verify OTP
    const otpResult = await otpService.verifyOTP({
      email,
      otpCode,
      purpose: 'email_verification'
    });

    if (!otpResult.success) {
      throw new Error(otpResult.message);
    }

    // Find pending registration
    const pendingRegistration = await this.pendingRegistrationRepository.findOne({
      where: { email }
    });

    if (!pendingRegistration) {
      throw new Error('Registration not found or expired');
    }

    if (pendingRegistration.expiresAt < new Date()) {
      await this.pendingRegistrationRepository.remove(pendingRegistration);
      throw new Error('Registration has expired. Please sign up again.');
    }

    // Create company first
    const company = this.companyRepository.create({
      companyName: pendingRegistration.companyName!,
      companyEmail: pendingRegistration.companyEmail!,
      companyPhone: pendingRegistration.companyPhone,
      companyAbn: pendingRegistration.companyAbn,
      subscriptionTier: SubscriptionTier.FREE,
      isActive: true,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
    });

    const savedCompany = await this.companyRepository.save(company);

    // Create admin user
    const user = this.userRepository.create({
      companyId: savedCompany.companyId,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
      firstName: pendingRegistration.firstName,
      lastName: pendingRegistration.lastName,
      phone: pendingRegistration.phone,
      role: UserRole.ADMIN, // First user is always admin
      isActive: true,
      emailVerifiedAt: new Date()
    });

    const savedUser = await this.userRepository.save(user);

    // Remove pending registration
    await this.pendingRegistrationRepository.remove(pendingRegistration);

    // Generate tokens
    const payload: JWTPayload = {
      userId: savedUser.userId,
      email: savedUser.email,
      role: savedUser.role,
      companyId: savedUser.companyId
    };

    const tokens = AuthUtils.generateTokenPair(payload);

    // Store refresh token
    await this.storeRefreshToken(savedUser.userId, tokens.refreshToken, ipAddress, userAgent);

    // Update last login
    savedUser.lastLoginAt = new Date();
    await this.userRepository.save(savedUser);

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(
        savedUser.email, 
        savedUser.firstName, 
        savedCompany.companyName
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail the verification if email fails
    }

    return {
      user: {
        userId: savedUser.userId,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        companyId: savedUser.companyId,
        companyName: savedCompany.companyName,
        isActive: savedUser.isActive
      },
      tokens
    };
  }

  async resendVerificationOTP(email: string): Promise<{ message: string }> {
    // Check if pending registration exists
    const pendingRegistration = await this.pendingRegistrationRepository.findOne({
      where: { email }
    });

    if (!pendingRegistration) {
      throw new Error('Registration not found or already completed');
    }

    if (pendingRegistration.expiresAt < new Date()) {
      await this.pendingRegistrationRepository.remove(pendingRegistration);
      throw new Error('Registration has expired. Please sign up again.');
    }

    // Resend OTP
    const result = await otpService.resendOTP(email, 'email_verification');
    
    if (!result.success) {
      throw new Error(result.message);
    }

    return {
      message: result.message
    };
  }

  async signIn(signInData: SignInRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // Find user with company data
    const user = await this.userRepository.findOne({
      where: { email: signInData.email, isActive: true },
      relations: ['company']
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.company.isActive) {
      throw new Error('Company account is inactive');
    }

    // Verify password
    const isPasswordValid = await AuthUtils.verifyPassword(signInData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    };

    const tokens = AuthUtils.generateTokenPair(payload);

    // Store refresh token
    await this.storeRefreshToken(user.userId, tokens.refreshToken, ipAddress, userAgent);

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return {
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company.companyName,
        isActive: user.isActive
      },
      tokens
    };
  }

  async refreshAccessToken(refreshTokenData: RefreshTokenRequest): Promise<{ accessToken: string }> {
    // Verify refresh token
    const payload = AuthUtils.verifyRefreshToken(refreshTokenData.refreshToken);

    // Check if refresh token exists in database and is valid
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { 
        tokenHash: AuthUtils.hashRefreshToken(refreshTokenData.refreshToken),
        userId: payload.userId,
        isRevoked: false
      },
      relations: ['user']
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    if (!storedToken.user.isActive) {
      throw new Error('User account is inactive');
    }

    // Update last used timestamp
    storedToken.lastUsedAt = new Date();
    await this.refreshTokenRepository.save(storedToken);

    // Generate new access token with fresh data
    const user = await this.userRepository.findOne({
      where: { userId: payload.userId, isActive: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newPayload: JWTPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    };

    const accessToken = AuthUtils.generateAccessToken(newPayload);

    return { accessToken };
  }

  async signOut(refreshToken: string, userId?: string): Promise<void> {
    const tokenHash = AuthUtils.hashRefreshToken(refreshToken);
    const query: any = { tokenHash };
    if (userId) {
      query.userId = userId;
    }

    const storedToken = await this.refreshTokenRepository.findOne({ where: query });
    
    if (storedToken) {
      storedToken.isRevoked = true;
      await this.refreshTokenRepository.save(storedToken);
    }
  }

  async signOutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  private async storeRefreshToken(userId: string, token: string, ipAddress?: string, userAgent?: string): Promise<void> {
    // Remove old expired tokens
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where('userId = :userId AND expiresAt < NOW()', { userId })
      .execute();

    // Hash the refresh token before storing
    const tokenHash = AuthUtils.hashRefreshToken(token);

    // Create new refresh token
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

  // Helper method for creating users by admin
  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyId: string;
    phone?: string;
    employeeId?: string;
  }): Promise<User> {
    // Only admins can create users (this should be enforced by middleware)
    
    // Validate password strength
    const passwordValidation = AuthUtils.validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await AuthUtils.hashPassword(userData.password);

    // Create user
    const user = this.userRepository.create({
      companyId: userData.companyId,
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || null,
      role: userData.role,
      employeeId: userData.employeeId || null,
      isActive: true,
      emailVerifiedAt: new Date() // Admin-created users are auto-verified
    });

    return this.userRepository.save(user);
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If an account with that email exists, we\'ve sent a password reset code.' };
    }

    // Generate and send OTP for password reset
    await otpService.createOTP({
      email,
      purpose: 'password_reset'
    });

    return { message: 'If an account with that email exists, we\'ve sent a password reset code.' };
  }

  async resetPassword(email: string, otpCode: string, newPassword: string): Promise<{ message: string }> {
    // Verify OTP
    const otpResult = await otpService.verifyOTP({
      email,
      otpCode,
      purpose: 'password_reset'
    });

    if (!otpResult.success) {
      throw new Error(otpResult.message);
    }

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    // Validate password strength
    const passwordValidation = AuthUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash new password
    const passwordHash = await AuthUtils.hashPassword(newPassword);

    // Update password
    user.passwordHash = passwordHash;
    await this.userRepository.save(user);

    // Revoke all refresh tokens for security
    await this.signOutAll(user.userId);

    return { message: 'Password reset successful. Please log in with your new password.' };
  }
}

export const authService = new AuthService();