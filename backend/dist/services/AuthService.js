"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const Company_1 = require("../entities/Company");
const RefreshToken_1 = require("../entities/RefreshToken");
const auth_1 = require("../utils/auth");
const enums_1 = require("../types/enums");
class AuthService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.companyRepository = database_1.AppDataSource.getRepository(Company_1.Company);
        this.refreshTokenRepository = database_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
    }
    async signUp(signUpData, ipAddress, userAgent) {
        // Validate password strength
        const passwordValidation = auth_1.AuthUtils.validatePassword(signUpData.password);
        if (!passwordValidation.isValid) {
            throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
        }
        // Validate email format
        if (!auth_1.AuthUtils.validateEmail(signUpData.email)) {
            throw new Error('Invalid email format');
        }
        if (!auth_1.AuthUtils.validateEmail(signUpData.companyEmail)) {
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
        // Hash password
        const passwordHash = await auth_1.AuthUtils.hashPassword(signUpData.password);
        // Create company first
        const company = this.companyRepository.create({
            companyName: signUpData.companyName,
            companyEmail: signUpData.companyEmail,
            companyPhone: signUpData.companyPhone,
            subscriptionTier: enums_1.SubscriptionTier.FREE,
            isActive: true,
            trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
        });
        const savedCompany = await this.companyRepository.save(company);
        // Create admin user
        const user = this.userRepository.create({
            companyId: savedCompany.companyId,
            email: signUpData.email,
            passwordHash,
            firstName: signUpData.firstName,
            lastName: signUpData.lastName,
            phone: signUpData.phone,
            role: enums_1.UserRole.ADMIN, // First user is always admin
            isActive: true,
            emailVerifiedAt: new Date() // Auto-verify for now
        });
        const savedUser = await this.userRepository.save(user);
        // Generate tokens
        const payload = {
            userId: savedUser.userId,
            email: savedUser.email,
            role: savedUser.role,
            companyId: savedUser.companyId
        };
        const tokens = auth_1.AuthUtils.generateTokenPair(payload);
        // Store refresh token
        await this.storeRefreshToken(savedUser.userId, tokens.refreshToken, ipAddress, userAgent);
        // Update last login
        savedUser.lastLoginAt = new Date();
        await this.userRepository.save(savedUser);
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
    async signIn(signInData, ipAddress, userAgent) {
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
        const isPasswordValid = await auth_1.AuthUtils.verifyPassword(signInData.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Generate tokens
        const payload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        };
        const tokens = auth_1.AuthUtils.generateTokenPair(payload);
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
    async refreshAccessToken(refreshTokenData) {
        // Verify refresh token
        const payload = auth_1.AuthUtils.verifyRefreshToken(refreshTokenData.refreshToken);
        // Check if refresh token exists in database and is valid
        const storedToken = await this.refreshTokenRepository.findOne({
            where: {
                token: refreshTokenData.refreshToken,
                userId: payload.userId,
                isRevoked: false
            },
            relations: ['user']
        });
        if (!storedToken || !storedToken.isValid()) {
            throw new Error('Invalid or expired refresh token');
        }
        if (!storedToken.user.isActive) {
            throw new Error('User account is inactive');
        }
        // Generate new access token with fresh data
        const user = await this.userRepository.findOne({
            where: { userId: payload.userId, isActive: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const newPayload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        };
        const accessToken = auth_1.AuthUtils.generateAccessToken(newPayload);
        return { accessToken };
    }
    async signOut(refreshToken, userId) {
        const query = { token: refreshToken };
        if (userId) {
            query.userId = userId;
        }
        const storedToken = await this.refreshTokenRepository.findOne({ where: query });
        if (storedToken) {
            storedToken.isRevoked = true;
            await this.refreshTokenRepository.save(storedToken);
        }
    }
    async signOutAll(userId) {
        await this.refreshTokenRepository.update({ userId, isRevoked: false }, { isRevoked: true });
    }
    async storeRefreshToken(userId, token, ipAddress, userAgent) {
        // Remove old expired tokens
        await this.refreshTokenRepository
            .createQueryBuilder()
            .delete()
            .from(RefreshToken_1.RefreshToken)
            .where('userId = :userId AND expiresAt < NOW()', { userId })
            .execute();
        // Create new refresh token
        const refreshToken = this.refreshTokenRepository.create({
            userId,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            ipAddress,
            userAgent
        });
        await this.refreshTokenRepository.save(refreshToken);
    }
    // Helper method for creating users by admin
    async createUser(userData) {
        // Only admins can create users (this should be enforced by middleware)
        // Validate password strength
        const passwordValidation = auth_1.AuthUtils.validatePassword(userData.password);
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
        const passwordHash = await auth_1.AuthUtils.hashPassword(userData.password);
        // Create user
        const user = this.userRepository.create({
            ...userData,
            passwordHash,
            isActive: true
        });
        return this.userRepository.save(user);
    }
}
exports.AuthService = AuthService;
