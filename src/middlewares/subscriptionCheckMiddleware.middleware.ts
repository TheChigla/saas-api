import { NextFunction, Request, Response } from 'express';
import { handleError } from '../utils/errorHandler.util';
import { getByIdService } from '../services/identityService.service';
import Company from '../models/Company.model';

export const subscriptionCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const foundCompany = await getByIdService(
      req.companyId,
      Company,
      '-password -_id'
    );

    if (!foundCompany) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    if (!foundCompany.registeredSubscriptionId) {
      res.status(400).json({
        message: 'Please choose subscription plan: free, basic or premium',
      });
      return;
    }

    next();
  } catch (error) {
    handleError(res, error);
  }
};
