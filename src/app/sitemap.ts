import type { MetadataRoute } from 'next';
import { locales } from './[locale]/../../i18n';
import { absoluteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/guia', '/blog', '/privacidad', '/terminos'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: absoluteUrl(`/${locale}${page}`),
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : page === '/blog' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/guia' ? 0.9 : page === '/blog' ? 0.8 : 0.5,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, absoluteUrl(`/${l}${page}`)])
          ),
        },
      });
    }
  }

  return entries;
}
