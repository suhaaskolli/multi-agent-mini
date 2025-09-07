import 'dotenv/config';
import { z } from 'zod';

const Env = z.object({
  TOGETHER_API_KEY: z.string().min(10, "Set TOGETHER_API_KEY in .env")
});

export const env = Env.parse({
  TOGETHER_API_KEY: process.env.TOGETHER_API_KEY
});
