import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const requiredFiles = [
  'src/app/page.tsx',
  'src/app/services/page.tsx',
  'src/app/services/[slug]/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/api/leads/route.ts',
  'src/app/api/admin/cms/route.ts',
  'src/components/admin-dashboard.tsx',
  'src/components/program-picker.tsx'
];

for (const file of requiredFiles) {
  const content = readFileSync(file, 'utf8');
  assert.ok(content.length > 200, `${file} must not be empty.`);
}

console.log('E2E static smoke tests passed.');
