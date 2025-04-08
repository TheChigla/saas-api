import { IEmployeeBody } from '../types/employeeTypes.type';
import Employee from '../models/Employee.model';
import { generateVerifyToken } from './jwtService.service';
import { sendEmail } from './mailService.service';
import { getByFieldService, getByIdService } from './identityService.service';
import Subscription from '../models/Subscription.model';
import Company from '../models/Company.model';
import { Types } from 'mongoose';

export const createEmployeeService = async (
  payload: IEmployeeBody
): Promise<string | null> => {
  const { email, companyId } = payload;
  const foundEmployee = await getByFieldService('email', email, Employee);

  if (foundEmployee) {
    throw new Error('Employee already exists with this email');
  }

  const company = await getByIdService(
    companyId.toString(),
    Company,
    '',
    'registeredSubscriptionId'
  );

  if (email === company.email) {
    throw new Error('Employee email cannot be same as company admin email');
  }

  const registeredSubscription = company.registeredSubscriptionId;

  if (
    !registeredSubscription ||
    registeredSubscription instanceof Types.ObjectId
  ) {
    throw new Error('No valid registered subscription found');
  }

  const subscription = await getByIdService(
    registeredSubscription.subscriptionId.toString(),
    Subscription
  );

  if (
    subscription.usersLimit !== 'unlimited' &&
    registeredSubscription.activeUsers >= subscription.usersLimit
  ) {
    throw new Error(
      'Employee registration limit reached. Upgrade your subscription'
    );
  }

  const employee = new Employee(payload);
  registeredSubscription.activeUsers += 1;
  if (subscription.pricePerUser > 0) {
    registeredSubscription.total += subscription.pricePerUser;

    if (company.balance < subscription.pricePerUser) {
      throw new Error('Insufficient balance to add new employee');
    }

    company.balance -= subscription.pricePerUser;
  }
  await Promise.all([employee.save(), registeredSubscription.save()]);

  const token = generateVerifyToken(employee._id.toString());
  sendEmail(email, {
    subject: 'Account Activation',
    text: `Click on the link to activate your account: ${process.env.API_URL}/employee/verify/${token}`,
  }).catch((error) => {
    throw new Error(error);
  });

  return token;
};

export const deleteEmployeeService = async (
  companyId: string,
  id: string
): Promise<void> => {
  const foundEmployee = await getByIdService(id, Employee);

  if (!foundEmployee) {
    throw new Error('Employee not found');
  }

  if (foundEmployee.companyId.toString() !== companyId) {
    throw new Error('You cannot delete employee outside your company');
  }

  const company = await getByIdService(
    companyId,
    Company,
    '',
    'registeredSubscriptionId'
  );
  const registeredSubscription = company.registeredSubscriptionId;

  if (
    !registeredSubscription ||
    registeredSubscription instanceof Types.ObjectId
  ) {
    throw new Error('No valid registered subscription found');
  }

  const foundSubscription = await getByIdService(
    registeredSubscription.subscriptionId.toString(),
    Subscription
  );

  if (foundSubscription.pricePerUser > 0) {
    registeredSubscription.total -= foundSubscription.pricePerUser;
  }

  await Employee.findByIdAndDelete(id);
  registeredSubscription.activeUsers -= 1;
  await registeredSubscription.save();
};
