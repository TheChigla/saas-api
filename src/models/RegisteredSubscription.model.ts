import { model, Schema } from 'mongoose';
import { IRegisteredSubscription } from '../types/subscriptionTypes.type';

const registeredSubscriptionSchema = new Schema<IRegisteredSubscription>(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    uploadedFiles: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    exceededFiles: { type: Number, default: 0 },
    exceededUsers: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const RegisteredSubscription = model<IRegisteredSubscription>(
  'RegisteredSubscription',
  registeredSubscriptionSchema
);

export default RegisteredSubscription;
