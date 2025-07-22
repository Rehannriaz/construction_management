import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { SignUpRequest, SignInRequest, RefreshTokenRequest } from '../types/auth';
import { UserRole } from '../types/enums';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new company and admin user
   *     description: Creates a new company with an admin user. Only admins can create additional users.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - firstName
   *               - lastName
   *               - companyName
   *               - companyEmail
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 example: Password123!
   *               firstName:
   *                 type: string
   *                 example: John
   *               lastName:
   *                 type: string
   *                 example: Doe
   *               companyName:
   *                 type: string
   *                 example: ABC Construction
   *               companyEmail:
   *                 type: string
   *                 format: email
   *                 example: contact@abcconstruction.com
   *               companyPhone:
   *                 type: string
   *                 example: "+61400000000"
   *               phone:
   *                 type: string
   *                 example: "+61400000001"
   *     responses:
   *       201:
   *         description: Company and admin user created successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: User or company already exists
   */
  signUp = async (req: Request, res: Response): Promise<void> => {
    try {
      const signUpData: SignUpRequest = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      const result = await this.authService.signUp(signUpData, ipAddress, userAgent);

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          email: result.email,
          requiresOTP: result.requiresOTP
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  };

  /**
   * @swagger
   * /auth/verify-otp:
   *   post:
   *     tags: [Authentication]
   *     summary: Verify OTP and complete signup
   *     description: Verifies the OTP code and activates the user account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - otpCode
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *               otpCode:
   *                 type: string
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: OTP verified successfully, user activated
   *       400:
   *         description: Invalid or expired OTP
   */
  verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otpCode } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      const result = await this.authService.verifyOTPAndCompleteSignup(email, otpCode, ipAddress, userAgent);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        message: 'Account verified successfully',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'OTP verification failed'
      });
    }
  };

  /**
   * @swagger
   * /auth/resend-otp:
   *   post:
   *     tags: [Authentication]
   *     summary: Resend OTP
   *     description: Resends the OTP code to the user's email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *     responses:
   *       200:
   *         description: OTP resent successfully
   *       400:
   *         description: Invalid email or user already verified
   */
  resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const result = await this.authService.resendVerificationOTP(email);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to resend OTP'
      });
    }
  };

  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     tags: [Authentication]
   *     summary: Sign in user
   *     description: Authenticates user and returns JWT tokens
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *               password:
   *                 type: string
   *                 example: Password123!
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   *       403:
   *         description: Account inactive
   */
  signIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const signInData: SignInRequest = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      const result = await this.authService.signIn(signInData, ipAddress, userAgent);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      });
    }
  };

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     tags: [Authentication]
   *     summary: Refresh access token
   *     description: Gets a new access token using refresh token
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: Refresh token (can also be sent as HTTP-only cookie)
   *     responses:
   *       200:
   *         description: New access token generated
   *       401:
   *         description: Invalid or expired refresh token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get refresh token from cookie or request body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
        return;
      }

      const result = await this.authService.refreshAccessToken({ refreshToken });

      res.json({
        success: true,
        message: 'Access token refreshed',
        data: {
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed'
      });
    }
  };

  /**
   * @swagger
   * /auth/signout:
   *   post:
   *     tags: [Authentication]
   *     summary: Sign out user
   *     description: Revokes refresh token and clears cookies
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Sign out successful
   *       401:
   *         description: Authentication required
   */
  signOut = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const userId = req.user?.userId;

      if (refreshToken) {
        await this.authService.signOut(refreshToken, userId);
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Sign out successful'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Sign out failed'
      });
    }
  };

  /**
   * @swagger
   * /auth/signout-all:
   *   post:
   *     tags: [Authentication]
   *     summary: Sign out from all devices
   *     description: Revokes all refresh tokens for the user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Signed out from all devices
   *       401:
   *         description: Authentication required
   */
  signOutAll = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      await this.authService.signOutAll(req.user.userId);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Signed out from all devices'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Sign out failed'
      });
    }
  };

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     tags: [Authentication]
   *     summary: Get current user profile
   *     description: Returns the authenticated user's profile information
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved
   *       401:
   *         description: Authentication required
   */
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user profile'
      });
    }
  };

  /**
   * @swagger
   * /auth/create-user:
   *   post:
   *     tags: [Authentication]
   *     summary: Create a new user (Admin only)
   *     description: Creates a new user. Only admins can create users.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - firstName
   *               - lastName
   *               - role
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 8
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [site_manager, worker, client]
   *               phone:
   *                 type: string
   *               employeeId:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Validation error
   *       403:
   *         description: Admin access required
   *       409:
   *         description: User already exists
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const userData = {
        ...req.body,
        companyId: req.user.companyId
      };

      // Validate role - admins can't create other admins
      if (userData.role === UserRole.ADMIN) {
        res.status(400).json({
          success: false,
          message: 'Cannot create admin users'
        });
        return;
      }

      const user = await this.authService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        }
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'User creation failed'
      });
    }
  };

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     tags: [Authentication]
   *     summary: Request password reset
   *     description: Sends a password reset OTP to the user's email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *     responses:
   *       200:
   *         description: Password reset code sent (if email exists)
   *       400:
   *         description: Invalid email format
   */
  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Email is required'
        });
        return;
      }

      const result = await this.authService.requestPasswordReset(email);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to request password reset'
      });
    }
  };

  /**
   * @swagger
   * /auth/reset-password:
   *   post:
   *     tags: [Authentication]
   *     summary: Reset password with OTP
   *     description: Resets the user's password using OTP verification
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - otpCode
   *               - newPassword
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *               otpCode:
   *                 type: string
   *                 example: "123456"
   *               newPassword:
   *                 type: string
   *                 minLength: 8
   *                 example: NewPassword123!
   *     responses:
   *       200:
   *         description: Password reset successful
   *       400:
   *         description: Invalid or expired OTP, or password validation failed
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otpCode, newPassword } = req.body;

      if (!email || !otpCode || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Email, OTP code, and new password are required'
        });
        return;
      }

      const result = await this.authService.resetPassword(email, otpCode, newPassword);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Password reset failed'
      });
    }
  };
}