"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const auth_1 = require("../utils/auth");
const enums_1 = require("../types/enums");
class AuthMiddleware {
}
exports.AuthMiddleware = AuthMiddleware;
// Verify JWT token and attach user to request
AuthMiddleware.authenticate = (req, res, next) => {
    try {
        const token = auth_1.AuthUtils.extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const payload = auth_1.AuthUtils.verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
// Authorize specific roles
AuthMiddleware.authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
            return;
        }
        next();
    };
};
// Admin only access
AuthMiddleware.requireAdmin = (req, res, next) => {
    AuthMiddleware.authorize([enums_1.UserRole.ADMIN])(req, res, next);
};
// Site Manager or Admin access
AuthMiddleware.requireSiteManagerOrAdmin = (req, res, next) => {
    AuthMiddleware.authorize([enums_1.UserRole.ADMIN, enums_1.UserRole.SITE_MANAGER])(req, res, next);
};
// Worker, Site Manager, or Admin access
AuthMiddleware.requireWorkerOrAbove = (req, res, next) => {
    AuthMiddleware.authorize([enums_1.UserRole.ADMIN, enums_1.UserRole.SITE_MANAGER, enums_1.UserRole.WORKER])(req, res, next);
};
// Optional authentication - doesn't fail if no token
AuthMiddleware.optionalAuth = (req, res, next) => {
    try {
        const token = auth_1.AuthUtils.extractTokenFromHeader(req.headers.authorization);
        if (token) {
            const payload = auth_1.AuthUtils.verifyAccessToken(token);
            req.user = payload;
        }
        next();
    }
    catch (error) {
        // Invalid token, but we continue without authentication
        next();
    }
};
// Company isolation - ensure user can only access their company's data
AuthMiddleware.requireSameCompany = (companyIdParam = 'companyId') => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const requestedCompanyId = req.params[companyIdParam] || req.body.companyId || req.query.companyId;
        // Admin can access any company
        if (req.user.role === enums_1.UserRole.ADMIN && !requestedCompanyId) {
            next();
            return;
        }
        // Users can only access their own company's data
        if (requestedCompanyId && requestedCompanyId !== req.user.companyId) {
            res.status(403).json({
                success: false,
                message: 'Access denied to other company data'
            });
            return;
        }
        next();
    };
};
