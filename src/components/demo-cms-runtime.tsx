'use client';

import { useEffect } from 'react';
import { DEMO_CONTENT_STORAGE_KEY, defaultDemoContent, normalizeDemoContent, type DemoContent } from '@/features/demo-admin/demo-content';

function readDemoContent(): DemoContent {
  try {
    const raw = window.localStorage.getItem(DEMO_CONTENT_STORAGE_KEY);
    if (raw === null) return defaultDemoContent;
    return normalizeDemoContent(JSON.parse(raw) as Partial<DemoContent>);
  } catch {
    return defaultDemoContent;
  }
}

function writeText(selector: string, value: string): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.textContent = value;
  });
}

function writeHref(selector: string, value: string, prefix: 'tel:' | 'mailto:'): void {
  document.querySelectorAll<HTMLAnchorElement>(selector).forEach((element) => {
    element.href = `${prefix}${prefix === 'tel:' ? value.replace(/[^+0-9]/g, '') : value}`;
  });
}

function applyDemoContent(): void {
  const content = readDemoContent();
  writeText('[data-demo-text="hero-eyebrow"]', content.heroEyebrow);
  writeText('[data-demo-text="hero-line-1"]', content.heroLine1);
  writeText('[data-demo-text="hero-line-2"]', content.heroLine2);
  writeText('[data-demo-text="hero-line-3"]', content.heroLine3);
  writeText('[data-demo-text="hero-description"]', content.heroDescription);
  writeText('[data-demo-text="primary-button"]', content.primaryButton);
  writeText('[data-demo-text="secondary-button"]', content.secondaryButton);
  writeText('[data-demo-text="phone"]', content.phone);
  writeText('[data-demo-text="email"]', content.email);
  writeText('[data-demo-text="address"]', content.address);
  writeText('[data-demo-text="work-hours"]', content.workHours);
  writeText('[data-demo-text="footer-description"]', content.footerDescription);
  writeHref('[data-demo-href="phone"]', content.phone, 'tel:');
  writeHref('[data-demo-href="email"]', content.email, 'mailto:');
}

export function DemoCmsRuntime() {
  useEffect(() => {
    applyDemoContent();
    const onStorage = (event: StorageEvent) => {
      if (event.key === DEMO_CONTENT_STORAGE_KEY) applyDemoContent();
    };
    const onDemoUpdate = () => applyDemoContent();
    window.addEventListener('storage', onStorage);
    window.addEventListener('mgipo-demo-content-updated', onDemoUpdate);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('mgipo-demo-content-updated', onDemoUpdate);
    };
  }, []);

  return null;
}
