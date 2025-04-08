import { Request, Response } from 'express';
import { handleError } from '../utils/errorHandler.util';
import {
  deleteFileService,
  updateFileService,
  uploadFileService,
  viewFileService,
} from '../services/fileService.service';
import { IAllowedEmployees } from '../types/fileTypes.type';

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await uploadFileService(req);

    res.status(200).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body: IAllowedEmployees = req.body;

    const file = await updateFileService(req.employeeId, req.params.id, body);

    res.status(200).json({ message: 'File successfully updated' });
  } catch (error) {
    handleError(res, error);
  }
};

export const viewFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = await viewFileService(req.employeeId, req.params.id);

    res.status(200).json({ message: file });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteFileService(req.employeeId, req.params.id);

    res.status(200).json({ message: 'File successfully deleted' });
  } catch (error) {
    handleError(res, error);
  }
};
