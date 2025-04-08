import { Request, Response } from 'express';
import { ISubscription } from '../types/subscriptionTypes.type';
import { handleError } from '../utils/errorHandler.util';
import Subscription from '../models/Subscription.model';
import { getAllService } from '../services/identityService.service';
import { subscriptionSelectService } from '../services/subscriptionService.service';

export const createSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload: ISubscription = req.body;
    const newSubscription = new Subscription(payload);
    await newSubscription.save();

    res.status(201).json(newSubscription);
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const getSubscriptions = async (
  _: unknown,
  res: Response
): Promise<void> => {
  try {
    const subscriptions = await getAllService(Subscription, '-_id');

    res.status(200).json(subscriptions);
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const selectSubscription = async (req: Request, res: Response) => {
  try {
    const { field, value } = req.body;
    const companyId = req.companyId;

    await subscriptionSelectService(field, value, companyId);

    res
      .status(200)
      .json({ message: 'Subscription plan successfully selected' });
  } catch (error) {
    handleError(res, error);
  }
};
