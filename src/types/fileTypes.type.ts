import { Document, Types } from 'mongoose';

export interface IAllowedEmployees {
  allowedEmployees: string[];
}

export interface IFile extends Document {
  companyId: Types.ObjectId;
  name: string;
  path: string;
  employeeId: Types.ObjectId;
  allowedEmployees: string[];
}
