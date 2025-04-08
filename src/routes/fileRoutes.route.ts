import { Router } from 'express';
import { authenticateEmployeeToken } from '../middlewares/employeeAuthMiddleware.middleware';
import {
  deleteFile,
  updateFile,
  uploadFile,
  viewFile,
} from '../controllers/uploadController.controller';
import upload from '../middlewares/uploadMiddleware.middleware';
import {
  fileUpdateValidator,
  fileValidator,
} from '../middlewares/validatorMiddleware.middleware';
import { fileLimitMiddleware } from '../middlewares/fileLimitMiddleware.middleware';

const router = Router();

router.get('/:id', authenticateEmployeeToken, viewFile);
router.post(
  '/upload',
  authenticateEmployeeToken,
  fileValidator,
  fileLimitMiddleware,
  upload.single('document'),
  uploadFile
);
router.put('/:id', authenticateEmployeeToken, fileUpdateValidator, updateFile);
router.delete('/:id', authenticateEmployeeToken, deleteFile);

export default router;
