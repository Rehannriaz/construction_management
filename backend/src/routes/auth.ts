import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { signUpValidation, signInValidation, createUserValidation, verifyOTPValidation, resendOTPValidation } from '../middleware/validations/authValidations';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/signup', signUpValidation, validationMiddleware, authController.signUp);
router.post('/signin', signInValidation, validationMiddleware, authController.signIn);
router.post('/refresh', authController.refreshToken);
router.post('/verify-otp', verifyOTPValidation, validationMiddleware, authController.verifyOTP);
router.post('/resend-otp', resendOTPValidation, validationMiddleware, authController.resendOTP);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.post('/signout', AuthMiddleware.optionalAuth, authController.signOut);
router.post('/signout-all', AuthMiddleware.authenticate, authController.signOutAll);
router.get('/me', AuthMiddleware.authenticate, authController.getCurrentUser);

// Admin only routes
router.post('/create-user', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.requireAdmin, 
  createUserValidation, 
  validationMiddleware, 
  authController.createUser
);

export { router as authRoutes };