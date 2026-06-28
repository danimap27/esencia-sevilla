import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { type Locale } from '@/i18n';
import { absoluteUrl } from '@/lib/utils';
import { BLOG_POSTS } from '@/data/blog-posts';
import { APARTMENT } from '@/data/apartment';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: t('blogTitle'),
    description: t('blogDescription'),
    openGraph: {
      title: t('blogTitle'),
      description: t('blogDescription'),
      url: absoluteUrl(`/${locale}/blog`),
      type: 'website',
    },
    alternates: {
      canonical: absoluteUrl(`/${locale}/blog`),
      languages: {
        es: absoluteUrl('/es/blog'),
        en: absoluteUrl('/en/blog'),
        fr: absoluteUrl('/fr/blog'),
        de: absoluteUrl('/de/blog'),
        it: absoluteUrl('/it/blog'),
        pt: absoluteUrl('/pt/blog'),
      },
    },
  };
}

export default async function BlogPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  return (
    <div className="min-h-screen bg-crema">
      {/* Header */}
      <header className="bg-tinta text-crema py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t('title')}</h1>
          <p className="text-lg text-crema/70 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </header>

      {/* Posts grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl bg-white border border-tinta/10 hover:shadow-lg transition-shadow"
            >
              {/* Cover image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.titleKey}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-tinta">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-serif font-semibold text-tinta mb-2 group-hover:text-terracota-600 transition-colors">
                  {post.titleKey.includes('.') ? t(`posts.${post.slug.split('-')[0]}.title` as any) : post.titleKey}
                </h2>
                <p className="text-sm text-tinta/60 mb-4 line-clamp-2">
                  {t(`posts.${post.slug.split('-')[0]}.excerpt` as any)}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-tinta/40">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.publishedAt).toLocaleDateString(locale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {t('minRead', { min: post.minRead })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}