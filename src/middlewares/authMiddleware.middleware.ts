import jwt from 'jsonwebtoken';
import { IDecodedToken } from '../types/jwtTypes.type';
import { NextFunction, Request, Response } from 'express';
import jwtConfig from '../config/jwt.config';

export const authenticateToken = async (
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

    req.companyId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
