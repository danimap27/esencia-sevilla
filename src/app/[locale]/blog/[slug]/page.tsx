import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { type Locale } from '@/i18n';
import { absoluteUrl } from '@/lib/utils';
import { BLOG_POSTS } from '@/data/blog-posts';
import { APARTMENT } from '@/data/apartment';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.titleKey,
    description: post.excerptKey,
    openGraph: {
      title: post.titleKey,
      description: post.excerptKey,
      url: absoluteUrl(`/${locale}/blog/${slug}`),
      type: 'article',
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.titleKey }],
    },
    alternates: {
      canonical: absoluteUrl(`/${locale}/blog/${slug}`),
    },
  };
}

// Simple markdown renderer (basic: headings, bold, paragraphs, lists)
function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-4 space-y-1 text-tinta/80">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={i} className="text-3xl font-serif text-tinta mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={i} className="text-2xl font-serif text-tinta mt-6 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="text-xl font-serif text-tinta mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ') || line.match(/^\d+\. /)) {
      listItems.push(line.replace(/^(- |\d+\. )/, ''));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      // Handle bold
      const parts = line.split(/\*\*(.+?)\*\*/g);
      elements.push(
        <p key={i} className="text-tinta/80 leading-relaxed mb-3">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-tinta">{part}</strong> : part)}
        </p>
      );
    }
  });
  flushList();

  return elements;
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  // Get content in the right language (fallback to es then en)
  const langMap: Record<string, keyof typeof post.content> = {
    es: 'es', en: 'en', fr: 'fr',
  };
  const contentLang = langMap[locale] || 'es';
  const content = post.content[contentLang] || post.content.es;

  // Schema Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleKey,
    description: post.excerptKey,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: APARTMENT.name },
    publisher: {
      '@type': 'Organization',
      name: APARTMENT.name,
      url: absoluteUrl('/'),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Hero with cover image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.titleKey}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-terracota-500 text-white text-xs font-medium mb-3">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-3">
              {post.titleKey.includes('.') ? post.titleKey.split('.').pop() : post.titleKey}
            </h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString(locale)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {post.minRead} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        {/* Back link */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-terracota-500 hover:text-terracota-600 mb-8"
        >
          <ArrowLeft size={16} /> {locale === 'es' ? 'Volver al blog' : 'Back to blog'}
        </Link>

        {/* Markdown content */}
        <div className="prose prose-lg max-w-none">
          {renderMarkdown(content)}
        </div>
      </article>
    </div>
  );
}