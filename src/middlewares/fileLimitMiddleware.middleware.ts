import { Types } from 'mongoose';
import Employee from '../models/Employee.model';
import { getByIdService } from '../services/identityService.service';
import Subscription from '../models/Subscription.model';
import { NextFunction, Request, Response } from 'express';
import RegisteredSubscription from '../models/RegisteredSubscription.model';
import { handleError } from '../utils/errorHandler.util';

export const fileLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const company = await getByIdService(
      req.employeeId,
      Employee,
      '',
      'companyId'
    );
    const foundCompany = company.companyId;

    if (!foundCompany || foundCompany instanceof Types.ObjectId) {
      res.status(400).json({ error: 'No valid company found' });
      return;
    }

    const registeredSubscription = await getByIdService(
      foundCompany.registeredSubscriptionId.toString(),
      RegisteredSubscription
    );

    if (!registeredSubscription) {
      res.status(400).json({ message: 'Registered subscription not found' });
      return;
    }

    const subscription = await getByIdService(
      registeredSubscription.subscriptionId.toString(),
      Subscription,
      ''
    );

    if (!subscription) {
      res.status(400).json({ error: 'Subscription not found' });
      return;
    }

    if (subscription.exceededFilesPrice <= 0) {
      if (registeredSubscription.uploadedFiles === subscription.filesLimit) {
        res.status(400).json({ error: 'Maximum file upload limit reached' });
        return;
      }
    } else {
      if (registeredSubscription.uploadedFiles >= subscription.filesLimit) {
        const exceededFiles =
          registeredSubscription.uploadedFiles + 1 - subscription.filesLimit;
        const total = subscription.exceededFilesPrice * exceededFiles;

        if (foundCompany.balance < total) {
          res.status(400).json({
            error: 'Company balance is insufficient to upload more files',
          });
          return;
        }

        foundCompany.balance -= total;
        registeredSubscription.total += total;

        await Promise.all([foundCompany.save(), registeredSubscription.save()]);
      }
    }

    next();
  } catch (error) {
    handleError(res, error);
  }
};
