import jwt, { SignOptions } from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config';
import { IDecodedToken } from '../types/jwtTypes.type';

const verifyOptions: SignOptions = {
  expiresIn: jwtConfig.verificationExpiresIn,
};

const accessOptions: SignOptions = {
  expiresIn: jwtConfig.accessExpiresIn,
};

export const generateVerifyToken = (id: string): string => {
  return jwt.sign({ id }, jwtConfig.verificationSecretKey!, verifyOptions);
};

export const generateAccessToken = (id: string): string => {
  return jwt.sign({ id }, jwtConfig.accessSecretKey!, accessOptions);
};

export const verifyVerificationToken = (token: string): string => {
  return (jwt.verify(token, jwtConfig.verificationSecretKey!) as IDecodedToken)
    .id;
};
