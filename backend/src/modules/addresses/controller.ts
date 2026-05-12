import { Request, Response, NextFunction } from 'express';
import * as addressService from './service.js';
import { successResponse } from '../../utils/responseHandler.js';

export const getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await addressService.getMyAddresses(req.user.id);
    return successResponse({
      res,
      data: { addresses },
      message: 'Addresses fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await addressService.createAddress(req.user.id, req.body);
    return successResponse({
      res,
      data: { address },
      message: 'Address created successfully',
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await addressService.deleteAddress(req.params.id, req.user.id);
    return successResponse({
      res,
      message: 'Address deleted successfully',
      statusCode: 204
    });
  } catch (error) {
    next(error);
  }
};
