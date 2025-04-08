import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.middleware';
import {
  deleteEmployee,
  getAllEmployees,
  loginEmployee,
  registerEmployee,
  setPassword,
  verifyEmployee,
  verifyEmployeeAgain,
} from '../controllers/employeeController.controller';
import {
  loginEmployeeValidator,
  registerEmployeeValidator,
  setPasswordValidator,
  verifyEmployeeValidator,
} from '../middlewares/validatorMiddleware.middleware';
import { subscriptionCheckMiddleware } from '../middlewares/subscriptionCheckMiddleware.middleware';

const router = Router();

router.get(
  '/all',
  authenticateToken,
  subscriptionCheckMiddleware,
  getAllEmployees
);
router.get('/verify/:token', verifyEmployee);
router.post(
  '/register',
  authenticateToken,
  subscriptionCheckMiddleware,
  registerEmployeeValidator,
  registerEmployee
);
router.post('/verify', verifyEmployeeValidator, verifyEmployeeAgain);
router.post('/login', loginEmployeeValidator, loginEmployee);
router.put('/set-password', setPasswordValidator, setPassword);
router.delete(
  '/delete/:id',
  authenticateToken,
  subscriptionCheckMiddleware,
  deleteEmployee
);

export default router;
