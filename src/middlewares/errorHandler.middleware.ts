import { Request, Response, NextFunction } from 'express';

export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  res.json({
    error: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
};

export default errorHandlerMiddleware;
