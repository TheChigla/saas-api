import { genSalt, hashSync } from "bcryptjs";

export default async function hashField(field: string, saltSize: number) {
  try {
    return hashSync(field, await genSalt(saltSize));
  } catch (error) {
    throw error;
  }
}
