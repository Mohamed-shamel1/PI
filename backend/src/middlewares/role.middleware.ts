import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

/** Restrict route to users whose `role` matches one of the allowed values (case-insensitive). */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as string | undefined;

    if (!userRole) {
      return next(new AppError('Access denied', 403));
    }

    const isAllowed = allowedRoles.some(
      (role) => role.toUpperCase() === userRole.toUpperCase()
    );

    if (!isAllowed) {
      return next(new AppError('Access denied for this role', 403));
    }

    next();
  };
};
