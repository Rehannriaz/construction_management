import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { signUpValidation, signInValidation, createUserValidation } from '../middleware/validations/authValidations';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/signup', signUpValidation, validationMiddleware, authController.signUp);
router.post('/signin', signInValidation, validationMiddleware, authController.signIn);
router.post('/refresh', authController.refreshToken);

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