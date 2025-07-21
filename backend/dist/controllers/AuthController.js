"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const enums_1 = require("../types/enums");
class AuthController {
    constructor() {
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
        this.signUp = async (req, res) => {
            try {
                const signUpData = req.body;
                const ipAddress = req.ip;
                const userAgent = req.get('User-Agent');
                const result = await this.authService.signUp(signUpData, ipAddress, userAgent);
                // Set refresh token as HTTP-only cookie
                res.cookie('refreshToken', result.tokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.status(201).json({
                    success: true,
                    message: 'Company and admin user created successfully',
                    data: {
                        user: result.user,
                        accessToken: result.tokens.accessToken
                    }
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Registration failed'
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
        this.signIn = async (req, res) => {
            try {
                const signInData = req.body;
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
            }
            catch (error) {
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
        this.refreshToken = async (req, res) => {
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
            }
            catch (error) {
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
        this.signOut = async (req, res) => {
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
            }
            catch (error) {
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
        this.signOutAll = async (req, res) => {
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
            }
            catch (error) {
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
        this.getCurrentUser = async (req, res) => {
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
            }
            catch (error) {
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
        this.createUser = async (req, res) => {
            try {
                if (!req.user || req.user.role !== enums_1.UserRole.ADMIN) {
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
                if (userData.role === enums_1.UserRole.ADMIN) {
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
            }
            catch (error) {
                const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 400;
                res.status(statusCode).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'User creation failed'
                });
            }
        };
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
