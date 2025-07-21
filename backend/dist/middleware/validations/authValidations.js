"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidation = exports.signInValidation = exports.signUpValidation = void 0;
const express_validator_1 = require("express-validator");
const enums_1 = require("../../types/enums");
exports.signUpValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character'),
    (0, express_validator_1.body)('firstName')
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('lastName')
        .isLength({ min: 2, max: 100 })
        .withMessage('Last name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('companyName')
        .isLength({ min: 2, max: 255 })
        .withMessage('Company name must be between 2 and 255 characters')
        .trim(),
    (0, express_validator_1.body)('companyEmail')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid company email address'),
    (0, express_validator_1.body)('companyPhone')
        .optional()
        .matches(/^\+?[0-9\s\-\(\)]{8,20}$/)
        .withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^\+?[0-9\s\-\(\)]{8,20}$/)
        .withMessage('Please provide a valid phone number')
];
exports.signInValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.createUserValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character'),
    (0, express_validator_1.body)('firstName')
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('lastName')
        .isLength({ min: 2, max: 100 })
        .withMessage('Last name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('role')
        .isIn([enums_1.UserRole.SITE_MANAGER, enums_1.UserRole.WORKER, enums_1.UserRole.CLIENT])
        .withMessage('Role must be one of: site_manager, worker, client'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^\+?[0-9\s\-\(\)]{8,20}$/)
        .withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('employeeId')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Employee ID must be less than 50 characters')
        .trim()
];
