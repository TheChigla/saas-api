import { model, Schema } from 'mongoose';
import { IFile } from '../types/fileTypes.type';

const fileSchema = new Schema<IFile>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  allowedEmployees: [
    {
      type: String,
      ref: 'Employee',
    },
  ],
});

const File = model<IFile>('File', fileSchema);

export default File;
