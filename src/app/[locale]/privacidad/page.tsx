import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { APARTMENT } from '@/data/apartment';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: `${t('title')} — ${APARTMENT.name}`,
    robots: { index: true, follow: true },
  };
}

type Section = {
  t: string;
  p: string[];
  list?: string[];
  after?: { pre: string; link: string };
};

export default async function PrivacidadPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('privacy');
  const sections = t.raw('sections') as Section[];

  const fill = (s: string) =>
    s
      .replaceAll('{address}', APARTMENT.address)
      .replaceAll('{email}', APARTMENT.email)
      .replaceAll('{reg}', APARTMENT.registrationNumber);

  const updated = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-24">
        <nav className="text-sm text-tinta/50 mb-8">
          <Link href={`/${locale}`} className="hover:text-tinta">{t('home')}</Link>
          <span className="mx-2">›</span>
          <span>{t('title')}</span>
        </nav>

        <h1 className="text-4xl font-serif text-tinta mb-8">{t('title')}</h1>

        <div className="prose prose-tinta max-w-none space-y-6 text-tinta/80 leading-relaxed">
          <p><strong>{t('updated')}</strong> {updated}</p>

          {sections.map((section, si) => (
            <section key={si}>
              <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">{section.t}</h2>
              {section.p.map((para, pi) => (
                <p key={pi} className={pi > 0 ? 'mt-3' : undefined}>{fill(para)}</p>
              ))}
              {section.list && (
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  {section.list.map((item, li) => (
                    <li key={li}>{fill(item)}</li>
                  ))}
                </ul>
              )}
              {section.after && (
                <p className="mt-3">
                  {section.after.pre}{' '}
                  <a
                    href="https://www.aepd.es"
                    className="text-terracota-500 hover:underline"
                    target="_blank"
                    rel="noopener"
                  >
                    {section.after.link}
                  </a>
                  .
                </p>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
