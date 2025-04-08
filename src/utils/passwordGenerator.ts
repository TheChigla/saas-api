import crypto from 'crypto';

export default function generatePassword() {
  return crypto.randomBytes(16).toString('hex');
}
