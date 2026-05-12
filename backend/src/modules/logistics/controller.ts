import { Request, Response, NextFunction } from 'express';
import * as zoneService from './service.js';
import { successResponse } from '../../utils/responseHandler.js';

export const getZones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const zones = await zoneService.getAllZones();
    return successResponse({
      res,
      data: { zones },
      message: 'Zones fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const createZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const zone = await zoneService.createZone(req.body);
    return successResponse({
      res,
      data: { zone },
      message: 'Zone created successfully',
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
};

export const updateZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const zone = await zoneService.updateZone(req.params.id, req.body);
    return successResponse({
      res,
      data: { zone },
      message: 'Zone updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await zoneService.deleteZone(req.params.id);
    return successResponse({
      res,
      message: 'Zone deleted successfully',
      statusCode: 204
    });
  } catch (error) {
    next(error);
  }
};
