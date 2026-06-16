import type { Metadata } from 'next';
import { company } from '@/lib/company';

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: ReadonlyArray<string>;
  noIndex?: boolean;
};

export function createMetadata(input: MetadataInput): Metadata {
  const url = new URL(input.path, company.siteUrl).toString();
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords === undefined ? undefined : [...input.keywords],
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false, nocache: true } : undefined,
    openGraph: {
      title: `${input.title} — ${company.shortName}`,
      description: input.description,
      url,
      siteName: company.name,
      locale: 'ru_RU',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${input.title} — ${company.shortName}`,
      description: input.description
    }
  };
}
