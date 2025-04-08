import { compare } from 'bcryptjs';
import Company from '../models/Company.model';
import Employee from '../models/Employee.model';
import { companyField, ICompany, industry } from '../types/companyTypes.type';
import hashField from '../utils/hashField.util';
import { getByFieldService, getByIdService } from './identityService.service';
import { generateVerifyToken } from './jwtService.service';
import { sendEmail } from './mailService.service';

export const createCompanyService = async (
  payload: ICompany
): Promise<string | null> => {
  const { email } = payload;

  const foundByEmail = await getByFieldService('email', email, Company);
  const foundByName = await getByFieldService('name', payload.name, Company);
  const foundEmployee = await getByFieldService('email', email, Employee);

  if (foundByEmail || foundByName) {
    throw new Error('Company already exists with this email or name');
  } else if (foundEmployee) {
    throw new Error(
      'You cannot register company with employee email. Try other email instead'
    );
  }

  const newCompany: ICompany = new Company(payload);
  newCompany.password = await hashField(payload.password, 10);
  await newCompany.save();

  const token = generateVerifyToken(newCompany?._id as string);

  sendEmail(email, {
    subject: 'Account Activation',
    text: `Click on the link to activate your account: ${process.env.API_URL}/company/verify/${token}`,
  }).catch((error) => {
    throw new Error(error);
  });

  return token;
};

export const changeCompanyFieldService = async (
  companyId: string,
  field: companyField,
  value: string | industry
): Promise<ICompany | null> => {
  const foundCompany = await getByIdService(companyId, Company, '-password');

  if (!foundCompany) {
    return null;
  }

  const keys = Object.keys(Company.schema.paths).filter(
    (key) =>
      ![
        '_id',
        '__v',
        'createdAt',
        'updatedAt',
        'sentAt',
        'password',
        'verified',
      ].includes(key)
  );

  if (!value) {
    throw new Error('Please provide a value to update');
  }

  if (!keys.includes(field)) {
    throw new Error('Please provide a correct field name to update');
  }

  if (field === 'email') {
    const existingCompany = await getByFieldService('email', value, Company);

    if (existingCompany) {
      throw new Error('Company already exists with this email');
    }

    const invalidEmailCheck = !value.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g
    );

    if (invalidEmailCheck) {
      throw new Error('Please provide a valid email');
    }
  }

  if (field === 'name') {
    const existingCompany = await getByFieldService('name', value, Company);

    if (existingCompany && existingCompany.id === companyId) {
      throw new Error('Your company already has this name');
    }
  }

  if (field === 'industry') {
    foundCompany[field] = value as industry;
  } else {
    foundCompany[field] = value as string;
  }

  await foundCompany.save();

  return foundCompany;
};

export const changePasswordService = async (
  companyId: string,
  oldPassword: string,
  newPassword: string
) => {
  const foundCompany = await Company.findById(companyId);

  if (!foundCompany) {
    throw new Error('Company not found');
  }

  const isOldPasswordCorrect = await compare(
    oldPassword,
    foundCompany.password
  );

  if (!isOldPasswordCorrect) {
    throw new Error('Incorrect password. Please try again');
  }

  foundCompany.password = await hashField(newPassword, 10);
  await foundCompany.save();

  return 'Password changed successfully';
};
