import { model, Schema } from 'mongoose';
import { ICompany } from '../types/companyTypes.type';

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 10000,
    },
    registeredSubscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'RegisteredSubscription',
    },
    sentAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);
companySchema.index({ email: 1 });

const Company = model<ICompany>('Company', companySchema);

export default Company;
