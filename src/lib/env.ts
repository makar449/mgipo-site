import { z } from 'zod';

const devDefaults = {
  DATABASE_URL: 'postgresql://cpk_user:cpk_password@localhost:5432/cpk?schema=public',
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD_HASH: 'local-development-hash-placeholder',
  ADMIN_DEV_PASSWORD: 'admin2026',
  ADMIN_DEV_LOGIN_ENABLED: 'true',
  AUTH_SECRET: 'local-development-auth-secret-2026-please-change-in-production',
  AUTH_COOKIE_NAME: 'cpk_admin_session'
} as const;

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string().min(1),
  ADMIN_DEV_PASSWORD: z.string().min(1).optional(),
  ADMIN_DEV_LOGIN_ENABLED: z.enum(['true', 'false']).optional().default('false'),
  AUTH_SECRET: z.string().min(32),
  AUTH_COOKIE_NAME: z.string().min(1)
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production';
}

function cleanEnvValue(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const cleaned = value.trim().replace(/^['\"]+|['\"]+$/g, '');
  return cleaned.length === 0 ? undefined : cleaned;
}

function readDevValue(key: keyof typeof devDefaults): string {
  return cleanEnvValue(process.env[key]) ?? devDefaults[key];
}

function readRawEnvironment(): Record<string, string | undefined> {
  if (isProductionRuntime()) {
    return {
      DATABASE_URL: cleanEnvValue(process.env.DATABASE_URL),
      ADMIN_EMAIL: cleanEnvValue(process.env.ADMIN_EMAIL),
      ADMIN_PASSWORD_HASH: cleanEnvValue(process.env.ADMIN_PASSWORD_HASH),
      ADMIN_DEV_PASSWORD: cleanEnvValue(process.env.ADMIN_DEV_PASSWORD),
      ADMIN_DEV_LOGIN_ENABLED: cleanEnvValue(process.env.ADMIN_DEV_LOGIN_ENABLED),
      AUTH_SECRET: cleanEnvValue(process.env.AUTH_SECRET),
      AUTH_COOKIE_NAME: cleanEnvValue(process.env.AUTH_COOKIE_NAME)
    };
  }

  return {
    DATABASE_URL: readDevValue('DATABASE_URL'),
    ADMIN_EMAIL: readDevValue('ADMIN_EMAIL'),
    ADMIN_PASSWORD_HASH: readDevValue('ADMIN_PASSWORD_HASH'),
    ADMIN_DEV_PASSWORD: readDevValue('ADMIN_DEV_PASSWORD'),
    ADMIN_DEV_LOGIN_ENABLED: readDevValue('ADMIN_DEV_LOGIN_ENABLED'),
    AUTH_SECRET: readDevValue('AUTH_SECRET'),
    AUTH_COOKIE_NAME: readDevValue('AUTH_COOKIE_NAME')
  };
}

export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(readRawEnvironment());
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Invalid server environment: ${message}`);
  }

  if (isProductionRuntime() && parsed.data.ADMIN_PASSWORD_HASH === devDefaults.ADMIN_PASSWORD_HASH) {
    throw new Error('Invalid server environment: ADMIN_PASSWORD_HASH must be configured with a real bcrypt hash in production.');
  }

  if (isProductionRuntime() && parsed.data.AUTH_SECRET === devDefaults.AUTH_SECRET) {
    throw new Error('Invalid server environment: AUTH_SECRET must be configured with a unique production secret.');
  }

  if (isProductionRuntime() && parsed.data.ADMIN_DEV_LOGIN_ENABLED === 'true') {
    throw new Error('Invalid server environment: ADMIN_DEV_LOGIN_ENABLED must be false in production.');
  }

  return parsed.data;
}

export function getLocalAdminCredentialsForDevelopment(): { email: string; password: string; enabled: boolean } {
  const env = getServerEnv();
  return {
    email: env.ADMIN_EMAIL.toLowerCase(),
    password: env.ADMIN_DEV_PASSWORD ?? devDefaults.ADMIN_DEV_PASSWORD,
    enabled: process.env.NODE_ENV !== 'production' && env.ADMIN_DEV_LOGIN_ENABLED === 'true'
  };
}
