import { model, Schema } from 'mongoose';
import { ISubscription } from '../types/subscriptionTypes.type';

const subscriptionSchema = new Schema<ISubscription>(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
    filesLimit: {
      type: Number,
      required: true,
    },
    usersLimit: {
      type: Schema.Types.Mixed,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    pricePerUser: {
      type: Number,
      required: true,
    },
    exceededFilesPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
