import express from 'express';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import connectDB from './config/db.config';
import companyRoutes from './routes/companyRoutes.route';
import subscriptionRoutes from './routes/subscriptionRoutes.route';
import employeeRoutes from './routes/employeeRoutes.route';
import fileRoutes from './routes/fileRoutes.route';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware';

config();

const app = express();

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/company', companyRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/file', fileRoutes);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  process.env.NODE_ENV === 'development'
    ? () => {
        console.log(`Server is running on ${process.env.BASE_URL}`);
      }
    : undefined
);
