import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

async function main(): Promise<void> {
  const root = process.cwd();
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_DEV_PASSWORD ?? 'admin2026';
  const hash = await bcrypt.hash(password, 12);
  const secret = crypto.randomBytes(32).toString('hex');
  const envContent = [
    'DATABASE_URL="postgresql://cpk_user:cpk_password@localhost:5432/cpk?schema=public"',
    'NEXT_PUBLIC_SITE_URL="http://localhost:3000"',
    'NEXT_PUBLIC_COMPANY_NAME="Институт профессионального развития"',
    `ADMIN_EMAIL="${email}"`,
    `ADMIN_PASSWORD_HASH="${hash}"`,
    `ADMIN_DEV_PASSWORD="${password}"`,
    'ADMIN_DEV_LOGIN_ENABLED="true"',
    `AUTH_SECRET="${secret}"`,
    'AUTH_COOKIE_NAME="cpk_admin_session"'
  ].join('\n');

  await writeFile(path.join(root, '.env'), `${envContent}\n`, 'utf8');
  await writeFile(path.join(root, '.env.local'), `${envContent}\n`, 'utf8');

  if (!existsSync(path.join(root, '.local-data'))) {
    await import('node:fs/promises').then((fs) => fs.mkdir(path.join(root, '.local-data'), { recursive: true }));
  }

  console.log('Local environment is ready.');
  console.log(`Admin email: ${email}`);
  console.log(`Admin password: ${password}`);
  console.log('Next steps: npm run db:generate && npm run dev');
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
