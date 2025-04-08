import { Request } from 'express';
import { getByIdService } from './identityService.service';
import Employee from '../models/Employee.model';
import File from '../models/File.model';
import { IAllowedEmployees, IFile } from '../types/fileTypes.type';
import path from 'path';
import { Types } from 'mongoose';
import RegisteredSubscription from '../models/RegisteredSubscription.model';
const fs = require('fs');

export const uploadFileService = async (req: Request): Promise<void> => {
  if (!req.file) {
    throw new Error('File not found');
  }

  const currentDate = new Date();
  const employee = await getByIdService(
    req.employeeId,
    Employee,
    '',
    'companyId'
  );

  if (!employee) {
    throw new Error('Employee not found');
  }

  const company = employee.companyId;

  if (!company || company instanceof Types.ObjectId) {
    throw new Error('No valid company found');
  }

  const registeredSubscription = await getByIdService(
    company.registeredSubscriptionId.toString(),
    RegisteredSubscription
  );

  if (
    !registeredSubscription ||
    registeredSubscription instanceof Types.ObjectId
  ) {
    throw new Error('No valid registered subscription found');
  }

  const uploadedFile = new File({
    name: req.file.fieldname,
    path: `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${req.file.filename}`,
    companyId: employee.companyId,
    employeeId: req.employeeId,
    allowedEmployees: req.body.allowedEmployees,
  });
  registeredSubscription.uploadedFiles += 1;

  await Promise.all([uploadedFile.save(), registeredSubscription.save()]);
};

export const viewFileService = async (
  employeeId: string,
  id: string
): Promise<IFile> => {
  const employee = await getByIdService(employeeId, Employee, '');
  const file = await getByIdService(id, File);

  if (!employee) {
    throw new Error('Employee not found');
  } else if (!file) {
    throw new Error('Uploaded file not found');
  }

  const allowedEmployees = file.allowedEmployees;

  if (
    employeeId !== file.employeeId.toString() &&
    allowedEmployees &&
    allowedEmployees.length > 0 &&
    !allowedEmployees.includes(employee.email)
  ) {
    throw new Error('You are not eligible to view this file');
  }

  return await getByIdService(id, File);
};

export const updateFileService = async (
  employeeId: string,
  id: string,
  allowedEmployees: IAllowedEmployees
): Promise<void> => {
  const file = await getByIdService(id, File);

  if (!file) {
    throw new Error('File not found');
  } else if (file.employeeId.toString() !== employeeId) {
    throw new Error('You are not eligible to edit this file');
  }

  if (!allowedEmployees) {
    throw new Error('Please include allowed employees');
  }

  await File.findByIdAndUpdate(id, allowedEmployees);
};

export const deleteFileService = async (
  employeeId: string,
  fileId: string
): Promise<void> => {
  const file = await getByIdService(fileId, File);

  const company = await getByIdService(employeeId, Employee, '', 'companyId');
  const foundCompany = company.companyId;

  if (!foundCompany || foundCompany instanceof Types.ObjectId) {
    throw new Error('No valid company found');
  }

  const registeredSubscription = await getByIdService(
    foundCompany.registeredSubscriptionId.toString(),
    RegisteredSubscription
  );

  if (!registeredSubscription) {
    throw new Error('Registered subscription not found');
  }

  if (!file) {
    throw new Error('File not found');
  } else if (file.employeeId.toString() !== employeeId) {
    throw new Error('You are not eligible to delete this file');
  }

  const filePath = file.path;
  const fullPath = path.join(__dirname, '..', 'uploads', filePath);
  fs.unlink(fullPath, (error) => {});
  registeredSubscription.uploadedFiles -= 1;

  await Promise.all([
    await File.findByIdAndDelete(fileId),
    await registeredSubscription.save(),
  ]);
};
