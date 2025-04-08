import { config } from 'dotenv';

config();

export default {
  verificationSecretKey: process.env.JWT_VERIFICATION_SECRET,
  accessSecretKey: process.env.JWT_ACCESS_SECRET,
  verificationExpiresIn: '15m' as const,
  accessExpiresIn: '7d' as const,
};
