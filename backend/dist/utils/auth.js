"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthUtils {
    static async hashPassword(password) {
        return bcrypt_1.default.hash(password, this.SALT_ROUNDS);
    }
    static async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    static generateAccessToken(payload) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        const options = {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            issuer: 'site-tasker-api'
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
    }
    static generateRefreshToken(payload) {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET is not configured');
        }
        const options = {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            issuer: 'site-tasker-api'
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, options);
    }
    static verifyAccessToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    static verifyRefreshToken(token) {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET is not configured');
        }
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    }
    static generateTokenPair(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
    // Password validation
    static validatePassword(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Email validation
    static validateEmail(email) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    }
}
exports.AuthUtils = AuthUtils;
AuthUtils.SALT_ROUNDS = 12;
