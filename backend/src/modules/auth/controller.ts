import { Request, Response } from 'express';
import * as authService from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { successResponse } from '../../utils/responseHandler.js';
import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';
import { hashPassword, comparePassword } from '../../utils/security/hash.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return successResponse({ res, statusCode: 201, message: 'User registered', data: { user } });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  return successResponse({
    res,
    message: 'Login successful',
    data: { user, accessToken },
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(token);

  return successResponse({ res, message: 'Token refreshed', data: { accessToken } });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  if (req.user) await authService.logout(req.user.id);
  res.clearCookie('refreshToken');
  return successResponse({ res, message: 'Logged out successfully' });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, isActive: true, phone: true, avatar: true },
  });
  return successResponse({ res, data: { user } });
});

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, avatar: true },
  });
  return successResponse({ res, data: { user } });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { name, phone } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, phone },
    select: { id: true, name: true, email: true, phone: true, avatar: true },
  });

  return successResponse({ res, message: 'Profile updated successfully', data: { user: updatedUser } });
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const updateData: any = {};
  
  if (name) updateData.name = name;
  if (req.file) {
    updateData.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
  });

  return successResponse({ res, message: 'Profile updated successfully', data: { user: updatedUser } });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || !(await comparePassword(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect', 400);
  }

  const hashedNewPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword, refreshToken: null }, // Invalidate refresh token on password change
  });

  return successResponse({ res, message: 'Password changed successfully. Please log in again.' });
});

