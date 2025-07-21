import { body } from 'express-validator';
import { UserRole } from '../../types/enums';

export const signUpValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
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
    
  body('firstName')
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters')
    .trim(),
    
  body('lastName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters')
    .trim(),
    
  body('companyName')
    .isLength({ min: 2, max: 255 })
    .withMessage('Company name must be between 2 and 255 characters')
    .trim(),
    
  body('companyEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid company email address'),
    
  body('companyPhone')
    .optional()
    .matches(/^\+?[0-9\s\-\(\)]{8,20}$/)
    .withMessage('Please provide a valid phone number'),
    
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s\-\(\)]{8,20}$/)
    .withMessage('Please provide a valid phone number')
];

export const signInValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const createUserValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
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
    
  body('firstName')
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters')
    .trim(),
    
  body('lastName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters')
    .trim(),
    
  body('role')
    .isIn([UserRole.SITE_MANAGER, UserRole.WORKER, UserRole.CLIENT])
    .withMessage('Role must be one of: site_manager, worker, client'),
    
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s\-\(\)]{8,20}$/)
    .withMessage('Please provide a valid phone number'),
    
  body('employeeId')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Employee ID must be less than 50 characters')
    .trim()
];