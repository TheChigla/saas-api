import { Request, Response } from 'express';
import { handleError } from '../utils/errorHandler.util';
import {
  getAllService,
  loginService,
  setPasswordService,
  verificationService,
  verifyAgainService,
} from '../services/identityService.service';
import Employee from '../models/Employee.model';
import { IEmployeeBody } from '../types/employeeTypes.type';
import { Types } from 'mongoose';
import { ILoginInterface } from '../types/identityTypes.type';

import {
  createEmployeeService,
  deleteEmployeeService,
} from '../services/employeeService.service';
import Company from '../models/Company.model';

export const registerEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email } = req.body as IEmployeeBody;

    const payload = {
      firstName,
      lastName,
      email,
      companyId: new Types.ObjectId(req.companyId),
    };

    const token = await createEmployeeService(payload);

    res.status(200).json({
      message:
        'Employee registered successfully. Verification link has been sent.',
      token,
    });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const loginEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as ILoginInterface;

    const token = await loginService(
      Employee,
      { email, password },
      'employee',
      true
    );

    res.status(200).json({
      message: 'Employee successfully logged in',
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await verificationService(Employee, req.params.token, 'employee', true);
    res.status(200).json({
      message:
        'Employee verified successfully. One time password is sent to your email for log in',
    });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyEmployeeAgain = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body as { email: string };

    const token = await verifyAgainService(Employee, email, 'employee');
    res.status(200).json({ message: 'Verification email sent', token });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const setPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, oldPassword, newPassword } = req.body as {
    email: string;
    oldPassword: string;
    newPassword: string;
  };
  try {
    await setPasswordService(Employee, email, oldPassword, newPassword);

    res.status(200).json({
      message: 'Password set successfully. Please log in to your account',
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      message: await getAllService(
        Employee,
        '-_id -password -__v -createdAt -updatedAt'
      ),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employeeId = req.params.id;
    await deleteEmployeeService(req.companyId, employeeId);

    res.status(200).json({ message: 'Employee successfully deleted' });
  } catch (error) {
    handleError(res, error);
  }
};
