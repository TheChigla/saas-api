import multer from 'multer';
import path from 'path';
import fs from 'fs';

const allowedMimeTypes = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const storage = multer.diskStorage({
  destination: (_: unknown, __: unknown, cb) => {
    const currentDate = new Date();
    const folderPath = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const fullPath = path.join(__dirname, '../uploads', folderPath);

    fs.mkdir(fullPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err, null);
      }
      cb(null, fullPath);
    });
  },
  filename: (_: unknown, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (
  _: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type! Only CSV, XLS, and XLSX files are allowed.')
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_SIZE_LIMIT!) * 1024 * 1024,
  },
  fileFilter,
});

export default upload;
