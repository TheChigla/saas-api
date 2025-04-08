import jwt from 'jsonwebtoken';
import { IDecodedToken } from '../types/jwtTypes.type';
import { NextFunction, Request, Response } from 'express';
import jwtConfig from '../config/jwt.config';
import { getByIdService } from '../services/identityService.service';
import Employee from '../models/Employee.model';

export const authenticateEmployeeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token not provided' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.accessSecretKey!
    ) as IDecodedToken;
    const employee = await getByIdService(decoded.id, Employee);

    if (!employee) {
      res.status(403).json({ message: 'Employee not found with this token' });
      return;
    }

    req.employeeId = employee.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
