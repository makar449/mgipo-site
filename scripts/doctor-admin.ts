import bcrypt from 'bcryptjs';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) return {};
  const raw = readFileSync(filePath, 'utf8');
  const entries: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['\"]+|['\"]+$/g, '');
    entries[key] = value;
  }
  return entries;
}

async function main(): Promise<void> {
  const root = process.cwd();
  const env = { ...parseEnvFile(path.join(root, '.env')), ...parseEnvFile(path.join(root, '.env.local')) };
  const email = env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = env.ADMIN_DEV_PASSWORD ?? 'admin2026';
  const hash = env.ADMIN_PASSWORD_HASH ?? '';
  const hashLooksValid = /^\$2[aby]\$\d{2}\$/.test(hash);
  const hashMatches = hashLooksValid ? await bcrypt.compare(password, hash) : false;

  console.log('Admin diagnostics');
  console.log(`- ADMIN_EMAIL: ${email}`);
  console.log(`- ADMIN_DEV_PASSWORD: ${password}`);
  console.log(`- ADMIN_DEV_LOGIN_ENABLED: ${env.ADMIN_DEV_LOGIN_ENABLED ?? 'true by dev default'}`);
  console.log(`- ADMIN_PASSWORD_HASH exists: ${hash.length > 0 ? 'yes' : 'no'}`);
  console.log(`- ADMIN_PASSWORD_HASH bcrypt shape: ${hashLooksValid ? 'yes' : 'no'}`);
  console.log(`- Hash matches ADMIN_DEV_PASSWORD: ${hashMatches ? 'yes' : 'no'}`);
  console.log(`- AUTH_SECRET length: ${(env.AUTH_SECRET ?? '').length}`);
  console.log(`- DATABASE_URL: ${env.DATABASE_URL ?? 'missing'}`);
  console.log('Recommended local login:');
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
