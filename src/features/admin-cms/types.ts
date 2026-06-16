import { z } from 'zod';
import { serviceSchema } from '@/features/services/types';

export const cmsIdentitySchema = z.object({
  shortName: z.string().trim().min(1).max(40),
  fullName: z.string().trim().min(1).max(160),
  descriptor: z.string().trim().min(1).max(160),
  phone: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(140),
  address: z.string().trim().min(1).max(220),
  workHours: z.string().trim().min(1).max(160),
  license: z.string().trim().min(1).max(320)
});

export const cmsNavigationItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  href: z.string().trim().min(1).max(160),
  label: z.string().trim().min(1).max(40),
  visible: z.boolean()
});

export const cmsHomeStatSchema = z.object({
  id: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(24),
  label: z.string().trim().min(1).max(180),
  visible: z.boolean()
});

export const cmsHomeSchema = z.object({
  heroEyebrow: z.string().trim().min(1).max(180),
  heroTitle: z.string().trim().min(1).max(160),
  heroDescription: z.string().trim().min(1).max(900),
  primaryCtaLabel: z.string().trim().min(1).max(80),
  secondaryCtaLabel: z.string().trim().min(1).max(80),
  organizationTitle: z.string().trim().min(1).max(160),
  organizationDescription: z.string().trim().min(1).max(900),
  stats: z.array(cmsHomeStatSchema).min(1).max(8)
});

export const cmsFooterColumnSchema = z.object({
  id: z.string().trim().min(1).max(60),
  title: z.string().trim().min(1).max(80),
  links: z.array(z.object({ label: z.string().trim().min(1).max(80), href: z.string().trim().min(1).max(180), visible: z.boolean() })).max(12),
  visible: z.boolean()
});

export const cmsFooterSchema = z.object({
  description: z.string().trim().min(1).max(700),
  copyright: z.string().trim().min(1).max(180),
  columns: z.array(cmsFooterColumnSchema).max(6)
});

export const cmsDocumentSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(420),
  href: z.string().trim().min(1).max(260),
  visible: z.boolean()
});

export const cmsSeoSchema = z.object({
  defaultTitle: z.string().trim().min(1).max(120),
  defaultDescription: z.string().trim().min(1).max(260),
  keywords: z.string().trim().max(800),
  ogTitle: z.string().trim().min(1).max(120),
  ogDescription: z.string().trim().min(1).max(260)
});

export const cmsThemeSchema = z.object({
  primaryBlue: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  background: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  text: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  radius: z.enum(['strict', 'balanced', 'soft']),
  density: z.enum(['compact', 'balanced', 'spacious'])
});

export const cmsPageSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(1200),
  visible: z.boolean()
});

export const cmsContentSchema = z.object({
  identity: cmsIdentitySchema,
  navigation: z.array(cmsNavigationItemSchema).min(1).max(12),
  home: cmsHomeSchema,
  footer: cmsFooterSchema,
  documents: z.array(cmsDocumentSchema).max(80),
  pages: z.array(cmsPageSchema).max(40),
  seo: cmsSeoSchema,
  theme: cmsThemeSchema,
  services: z.record(serviceSchema),
  hiddenServiceIds: z.array(z.string().min(1)).max(1000)
});

export const cmsViewSchema = z.object({
  published: cmsContentSchema,
  draft: cmsContentSchema,
  updatedAt: z.string().nullable(),
  lastPublishedAt: z.string().nullable()
});

export const cmsPatchSchema = z.object({
  mode: z.enum(['draft', 'publish']),
  content: cmsContentSchema
});

export type CmsIdentity = z.infer<typeof cmsIdentitySchema>;
export type CmsNavigationItem = z.infer<typeof cmsNavigationItemSchema>;
export type CmsContent = z.infer<typeof cmsContentSchema>;
export type CmsView = z.infer<typeof cmsViewSchema>;
export type CmsPatch = z.infer<typeof cmsPatchSchema>;
