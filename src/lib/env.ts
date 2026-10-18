import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(12),
  AUTH_URL: z.string().url().optional(),
  ADMIN_NAME: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('MockCert'),
  APP_BASE_URL: z.string().url().optional(),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_UPLOAD_SIZE_MB: z.string().default('10'),
  ATTEMPT_TOKEN_SECRET: z.string().min(12).optional(),
  IP_HASH_SECRET: z.string().min(12).optional(),
  RATE_LIMIT_WINDOW_SECONDS: z.string().default('60'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('60'),
});

export const env = envSchema.parse(process.env);
