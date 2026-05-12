import { Request, Response, NextFunction } from 'express';
import * as couponService from './service.js';
import { successResponse } from '../../utils/responseHandler.js';

export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await couponService.getAllCoupons();
    return successResponse({
      res,
      data: { coupons },
      message: 'Coupons fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    return successResponse({
      res,
      data: { coupon },
      message: 'Coupon created successfully',
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    return successResponse({
      res,
      data: { coupon },
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    return successResponse({
      res,
      message: 'Coupon deleted successfully',
      statusCode: 204
    });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.getCouponByCode(req.params.code);
    return successResponse({
      res,
      data: { coupon },
      message: 'Coupon is valid'
    });
  } catch (error) {
    next(error);
  }
};
