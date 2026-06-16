import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db';
import { createDefaultCmsContent, writeCmsView } from '../src/lib/admin-cms';
import { getServerEnv } from '../src/lib/env';

async function main(): Promise<void> {
  const env = getServerEnv();
  const ownerRole = await prisma.adminRole.upsert({
    where: { key: 'OWNER' },
    update: {
      name: 'Владелец',
      permissions: ['*']
    },
    create: {
      key: 'OWNER',
      name: 'Владелец',
      permissions: ['*']
    }
  });

  const roles = [
    { key: 'ADMIN' as const, name: 'Администратор', permissions: ['leads:*', 'cms:*', 'services:*', 'documents:*', 'seo:*', 'users:read', 'audit:read'] },
    { key: 'MANAGER' as const, name: 'Менеджер', permissions: ['leads:read', 'leads:update', 'leads:export'] },
    { key: 'EDITOR' as const, name: 'Редактор', permissions: ['cms:read', 'cms:update', 'services:read', 'services:update', 'documents:update', 'seo:update'] },
    { key: 'VIEWER' as const, name: 'Наблюдатель', permissions: ['leads:read', 'cms:read', 'services:read', 'audit:read'] }
  ];

  for (const role of roles) {
    await prisma.adminRole.upsert({
      where: { key: role.key },
      update: { name: role.name, permissions: role.permissions },
      create: { key: role.key, name: role.name, permissions: role.permissions }
    });
  }

  const passwordHash = env.ADMIN_PASSWORD_HASH === 'local-development-hash-placeholder'
    ? await bcrypt.hash(env.ADMIN_DEV_PASSWORD ?? 'admin2026', 12)
    : env.ADMIN_PASSWORD_HASH;

  await prisma.adminUser.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { name: 'Главный администратор', passwordHash, isActive: true, roleId: ownerRole.id },
    create: { email: env.ADMIN_EMAIL, name: 'Главный администратор', passwordHash, isActive: true, roleId: ownerRole.id }
  });

  const content = createDefaultCmsContent();
  await writeCmsView(content, 'publish');

  await prisma.adminAuditLog.create({
    data: {
      action: 'DATABASE_SEEDED_V8',
      actorEmail: 'system',
      entityType: 'SYSTEM',
      payload: {
        message: 'Database initialized with full CMS, roles, user and MGIPO service catalog.',
        services: Object.keys(content.services).length,
        navigation: content.navigation.length,
        documents: content.documents.length
      }
    }
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
