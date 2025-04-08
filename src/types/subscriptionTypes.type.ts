import { Document, Types } from 'mongoose';

export type subscriptionType = 'free' | 'basic' | 'premium';

export interface ISubscription extends Document {
  type: subscriptionType;
  filesLimit: number;
  usersLimit: number | 'unlimited';
  price: number;
  pricePerUser: number;
  exceededFilesPrice: number;
}

export interface IRegisteredSubscription extends Document {
  subscriptionId: Types.ObjectId;
  companyId: Types.ObjectId;
  uploadedFiles: number;
  activeUsers: number;
  exceededFiles: number;
  exceededUsers: number;
  total: number;
}
