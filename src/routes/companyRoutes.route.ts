import {Router} from 'express';
import {
  changePasswordValidator,
  loginCompanyValidator,
  registerCompanyValidator,
} from '../middlewares/validatorMiddleware.middleware';
import {
  changeCompanyField,
  changePassword,
  companyDashboard,
  createCompany,
  loginCompany,
  verifyCompany,
  verifyCompanyAgain,
} from '../controllers/companyController.controller';
import {authenticateToken} from '../middlewares/authMiddleware.middleware';
import {subscriptionCheckMiddleware} from '../middlewares/subscriptionCheckMiddleware.middleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  subscriptionCheckMiddleware,
  companyDashboard
);
router.get('/verify/:token', verifyCompany);
router.post('/register', registerCompanyValidator, createCompany);
router.post('/login', loginCompanyValidator, loginCompany);
router.post('/verify', verifyCompanyAgain);
router.put('/change/:field', authenticateToken, changeCompanyField);
router.put(
  '/change-password',
  authenticateToken,
  changePasswordValidator,
  changePassword
);

export default router;
