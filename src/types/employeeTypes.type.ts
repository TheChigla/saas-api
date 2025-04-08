import { Document, Types } from 'mongoose';
import { IBaseInterface } from './identityTypes.type';
import { ICompany } from './companyTypes.type';

type Role = 'admin' | 'employee';

export interface IEmployeeBody {
  firstName: string;
  lastName: string;
  email: string;
  readonly companyId: Types.ObjectId;
}

export interface IEmployee extends IBaseInterface, Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  readonly companyId: Types.ObjectId | ICompany;
}
