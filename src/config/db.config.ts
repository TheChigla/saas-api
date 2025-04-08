import {config} from 'dotenv';
import mongoose from 'mongoose';

config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);

    process.env.NODE_ENV === 'development' &&
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    process.env.NODE_ENV === 'development' && console.error(error);
    process.exit(1);
  }
};

export default connectDB;
