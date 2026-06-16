import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = ['src/components/header.tsx', 'src/components/lead-form.tsx', 'src/components/program-picker.tsx', 'src/components/login-form.tsx'];
for (const file of files) {
  const content = readFileSync(file, 'utf8');
  assert.ok(content.includes('aria-') || content.includes('htmlFor'), `${file} must include accessible labels or aria attributes.`);
}
console.log('Accessibility static checks passed.');
