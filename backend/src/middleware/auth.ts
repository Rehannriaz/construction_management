import { Request, Response, NextFunction } from 'express';
import { AuthUtils, JWTPayload } from '../utils/auth';
import { UserRole } from '../types/enums';
import { AuthenticatedRequest } from '../types/auth';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  // Verify JWT token and attach user to request
  static authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        res.status(401).json({ 
          success: false, 
          message: 'Access token required' 
        });
        return;
      }

      const payload = AuthUtils.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  };

  // Authorize specific roles
  static authorize = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
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
  static requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    AuthMiddleware.authorize([UserRole.ADMIN])(req, res, next);
  };

  // Site Manager or Admin access
  static requireSiteManagerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
    AuthMiddleware.authorize([UserRole.ADMIN, UserRole.SITE_MANAGER])(req, res, next);
  };

  // Worker, Site Manager, or Admin access
  static requireWorkerOrAbove = (req: Request, res: Response, next: NextFunction): void => {
    AuthMiddleware.authorize([UserRole.ADMIN, UserRole.SITE_MANAGER, UserRole.WORKER])(req, res, next);
  };

  // Optional authentication - doesn't fail if no token
  static optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
      
      if (token) {
        const payload = AuthUtils.verifyAccessToken(token);
        req.user = payload;
      }
      
      next();
    } catch (error) {
      // Invalid token, but we continue without authentication
      next();
    }
  };

  // Company isolation - ensure user can only access their company's data
  static requireSameCompany = (companyIdParam = 'companyId') => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
        return;
      }

      const requestedCompanyId = req.params[companyIdParam] || req.body.companyId || req.query.companyId;

      // Admin can access any company
      if (req.user.role === UserRole.ADMIN && !requestedCompanyId) {
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
}