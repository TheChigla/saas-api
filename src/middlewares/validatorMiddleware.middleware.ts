import { NextFunction, Request, RequestHandler, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const registerCompanyValidator: RequestHandler[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
    .withMessage('Passwords do not match'),
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .bail()
    .isString()
    .withMessage('Country must be a string'),
  body('industry')
    .notEmpty()
    .withMessage('Industry is required')
    .bail()
    .isString()
    .withMessage('Industry must be a string'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  },
];

export const loginCompanyValidator: RequestHandler[] = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email'),
  body('password').notEmpty().withMessage('Password is required'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const changePasswordValidator: RequestHandler[] = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const registerEmployeeValidator: RequestHandler[] = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .bail()
    .isString()
    .withMessage('First name must be a string'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .bail()
    .isString()
    .withMessage('Last name must be a string'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const loginEmployeeValidator: RequestHandler[] = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const verifyEmployeeValidator: RequestHandler[] = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const setPasswordValidator: RequestHandler[] = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email'),
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
    .withMessage('Passwords do not match'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const fileValidator: RequestHandler[] = [
  body('allowedEmployees')
    .optional()
    .isArray()
    .withMessage('allowedEmployees must be an array')
    .custom((value) => {
      for (const email of value) {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          throw new Error(`Invalid email: ${email}`);
        }
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const fileUpdateValidator: RequestHandler[] = [
  body('allowedEmployees')
    .isArray()
    .withMessage('allowedEmployees must be an array')
    .custom((value) => {
      for (const email of value) {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          throw new Error(`Invalid email: ${email}`);
        }
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
