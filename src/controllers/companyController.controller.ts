import { Request, Response } from 'express';
import {
  changeCompanyFieldService,
  changePasswordService,
  createCompanyService,
} from '../services/companyService.service';
import { companyField, ICompany } from '../types/companyTypes.type';
import Company from '../models/Company.model';
import { handleError } from '../utils/errorHandler.util';
import {
  getByIdService,
  loginService,
  verificationService,
  verifyAgainService,
} from '../services/identityService.service';
import { ILoginInterface } from '../types/identityTypes.type';
import * as fs from 'node:fs';
import path from 'path';

export const createCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body: ICompany = req.body;

    const token = await createCompanyService(body);

    res.status(200).json({
      message:
        'Company registered successfully. Check your email for verification link',
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const verifiedCompany = await verificationService(
      Company,
      req.params.token,
      'company'
    );

    if (!verifiedCompany || !verifiedCompany.name) {
      res.status(400).json({ error: 'Invalid company data' });
      return;
    }

    const folderPath = path.join(
      __dirname,
      '..',
      'uploads',
      verifiedCompany.name
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
          return res.status(500).json({ error: 'Failed to create directory' });
        }
      });
    }

    res.status(200).json({ message: 'Company verified successfully' });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyCompanyAgain = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body as { email: string };

    const token = await verifyAgainService(Company, email, 'company');
    res.status(200).json({ message: 'Verification email sent', token });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const loginCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as ILoginInterface;

    const token = await loginService(Company, { email, password }, 'company');

    res.status(200).json({
      message: 'Company successfully logged in',
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const changeCompanyField = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const field = req.params.field as companyField;
    const { value } = req.body as { value: string };

    const updatedCompany = await changeCompanyFieldService(
      req.companyId,
      field,
      value
    );

    if (!updatedCompany) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    res.status(200).json({
      message: 'Company successfully updated.',
      company: updatedCompany,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    const message = await changePasswordService(
      req.companyId,
      oldPassword,
      newPassword
    );

    res.status(200).json({ message });
  } catch (error) {
    handleError(res, error);
  }
};

export const companyDashboard = async (req: Request, res: Response) => {
  try {
    const foundCompany = await getByIdService(
      req.companyId,
      Company,
      '-password -_id'
    );

    if (!foundCompany) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    res.status(200).json({ message: foundCompany });
  } catch (error) {
    handleError(res, error);
  }
};
