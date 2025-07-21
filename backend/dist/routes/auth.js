"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const authValidations_1 = require("../middleware/validations/authValidations");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const authController = new AuthController_1.AuthController();
// Public routes
router.post('/signup', authValidations_1.signUpValidation, validation_1.validationMiddleware, authController.signUp);
router.post('/signin', authValidations_1.signInValidation, validation_1.validationMiddleware, authController.signIn);
router.post('/refresh', authController.refreshToken);
// Protected routes
router.post('/signout', auth_1.AuthMiddleware.optionalAuth, authController.signOut);
router.post('/signout-all', auth_1.AuthMiddleware.authenticate, authController.signOutAll);
router.get('/me', auth_1.AuthMiddleware.authenticate, authController.getCurrentUser);
// Admin only routes
router.post('/create-user', auth_1.AuthMiddleware.authenticate, auth_1.AuthMiddleware.requireAdmin, authValidations_1.createUserValidation, validation_1.validationMiddleware, authController.createUser);
