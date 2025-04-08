import { Response } from 'express';

export function handleError(res: Response, error: unknown) {
  res.status(500).json({ error: `${error}` });
}
