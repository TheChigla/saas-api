import { Router } from 'express';
import {
  createSubscription,
  getSubscriptions,
  selectSubscription,
} from '../controllers/subscriptionController.controller';
import { authenticateToken } from '../middlewares/authMiddleware.middleware';

const router = Router();

router.get('/', authenticateToken, getSubscriptions);
router.post('/create', createSubscription);
router.post('/select', authenticateToken, selectSubscription);

export default router;
