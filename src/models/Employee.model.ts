import { model, Schema } from 'mongoose';
import { IEmployee } from '../types/employeeTypes.type';

const employeeSchema = new Schema<IEmployee>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: 'employee',
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    changedPassword: {
      type: Boolean,
      default: false,
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
employeeSchema.index({ companyId: 1, email: 1 });

const Employee = model<IEmployee>('Employee', employeeSchema);

export default Employee;
