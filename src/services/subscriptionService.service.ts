import { IRegisteredSubscription } from '../types/subscriptionTypes.type';
import { Types } from 'mongoose';
import { ICompany } from '../types/companyTypes.type';
import Subscription from '../models/Subscription.model';
import { getByFieldService, getByIdService } from './identityService.service';
import Company from '../models/Company.model';
import RegisteredSubscription from '../models/RegisteredSubscription.model';

export const subscriptionSelectService = async (
  field: string,
  value: string,
  companyId: string
) => {
  if (!field) {
    throw new Error('Subscription plan field is required');
  } else if (!value) {
    throw new Error('Subscription plan value is required');
  }

  const keys = Object.keys(Subscription.schema.paths).filter(
    (value) =>
      value !== '_id' &&
      value !== '__v' &&
      value !== 'createdAt' &&
      value !== 'updatedAt'
  );

  if (!keys.includes(field)) {
    throw new Error('Invalid subscription plan field');
  }

  const foundSubscription = await getByFieldService(field, value, Subscription);

  if (!foundSubscription) {
    throw new Error('Subscription plan not found');
  }

  const foundCompany = await getByIdService(
    companyId,
    Company,
    '',
    'registeredSubscriptionId'
  );

  if (!foundCompany) {
    throw new Error('Company not found');
  }

  const foundRegisteredSubscription = foundCompany.registeredSubscriptionId;
  const subscriptionPrice = foundSubscription.price;

  if (foundCompany.balance < subscriptionPrice) {
    throw new Error('Insufficient balance');
  }

  const registeredSubscription = new RegisteredSubscription({
    subscriptionId: foundSubscription._id,
    companyId: companyId,
    total: subscriptionPrice,
  });

  if (
    foundRegisteredSubscription &&
    !(foundRegisteredSubscription instanceof Types.ObjectId)
  ) {
    if (
      foundRegisteredSubscription.subscriptionId.toString() ===
      foundSubscription.id
    )
      throw new Error('Company has already purchased this plan');
    else {
      if (
        foundSubscription.usersLimit !== 'unlimited' &&
        foundRegisteredSubscription.activeUsers > foundSubscription.usersLimit
      )
        throw new Error(
          'You have registered more employees than this plan can handle.'
        );

      const activeUsers = foundRegisteredSubscription.activeUsers;
      if (foundSubscription.pricePerUser > 0) {
        const totalPrice =
          foundSubscription.price +
          foundSubscription.pricePerUser * activeUsers;

        if (foundCompany.balance < totalPrice) {
          throw new Error(
            'Insufficient balance to switch plan with current users.'
          );
        }

        registeredSubscription.total = totalPrice;
        foundCompany.balance -= totalPrice;
      }
      registeredSubscription.activeUsers =
        foundRegisteredSubscription.activeUsers;
      await RegisteredSubscription.findByIdAndDelete(
        foundRegisteredSubscription.id
      );
    }
  }

  foundCompany.registeredSubscriptionId =
    registeredSubscription._id as Types.ObjectId;
  foundCompany.balance -= subscriptionPrice;

  await Promise.all([registeredSubscription.save(), foundCompany.save()]);
};

export const getRegisteredSubscriptionService = async (
  company: ICompany
): Promise<IRegisteredSubscription | void> => {
  if (
    !company.registeredSubscriptionId ||
    company.registeredSubscriptionId instanceof Types.ObjectId
  ) {
    throw 'Registered subscription data not returned properly';
  }

  return company.registeredSubscriptionId;
};
