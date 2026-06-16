import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/app/globals.css', 'utf8');
for (const query of ['max-width: 360px', 'max-width: 767px', 'max-width: 1023px', 'prefers-reduced-motion', 'v8.5 site-wide typography/layout QA']) {
  assert.ok(css.includes(query), `CSS must include responsive/performance rule: ${query}`);
}

assert.equal(css.includes('overflow-wrap: anywhere;'), false, 'Site CSS must not use overflow-wrap:anywhere because it creates letter-by-letter Russian wrapping.');
assert.equal(css.includes('hyphens: auto;'), false, 'Site CSS must not use automatic hyphenation because it breaks Russian headings and cards.');

const button = readFileSync('src/components/ui/button.tsx', 'utf8');
assert.ok(!button.includes('whitespace-nowrap transition duration-200'), 'Base button must not force nowrap globally. Header buttons can opt into nowrap only where safe.');

const serviceCard = readFileSync('src/components/service-card.tsx', 'utf8');
assert.equal(serviceCard.includes('break-words'), false, 'Service cards must not force break-words; text must wrap at normal word boundaries.');

const home = readFileSync('src/app/page.tsx', 'utf8');
assert.ok(home.includes('hero-stats-grid mt-5 grid gap-3'), 'Hero stats must use CSS-controlled readable grid.');
assert.equal(home.includes('2xl:grid-cols-4'), false, 'Hero stats must not force four narrow columns in the hero text column.');

const adminDashboard = readFileSync('src/components/admin-dashboard.tsx', 'utf8');
for (const marker of ['Создать программу', 'Добавить документ', 'Опубликовать на сайт', 'Есть несохранённые изменения']) {
  assert.ok(adminDashboard.includes(marker), `Admin dashboard must include real management affordance: ${marker}`);
}

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const serviceVariantBlock = schema.match(/model ServiceVariant \{[\s\S]*?\n\}/)?.[0] ?? '';
assert.equal((serviceVariantBlock.match(/\bprice\s+Int\b/g) ?? []).length, 1, 'ServiceVariant must contain exactly one price field.');

console.log('Visual static checks passed.');
