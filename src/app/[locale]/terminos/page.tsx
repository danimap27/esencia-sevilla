import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { APARTMENT } from '@/data/apartment';
import { TERMS } from '@/data/terms';

const HOME_LABEL: Record<string, string> = {
  es: 'Inicio',
  en: 'Home',
  fr: 'Accueil',
  de: 'Startseite',
  it: 'Home',
  pt: 'Início',
};

const UPDATED_LABEL: Record<string, string> = {
  es: 'Última actualización:',
  en: 'Last updated:',
  fr: 'Dernière mise à jour :',
  de: 'Letzte Aktualisierung:',
  it: 'Ultimo aggiornamento:',
  pt: 'Última atualização:',
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const terms = TERMS[locale as keyof typeof TERMS] ?? TERMS.es;
  return {
    title: `${terms.title} — ${APARTMENT.name}`,
    robots: { index: true, follow: true },
  };
}

export default async function TerminosPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const terms = TERMS[locale as keyof typeof TERMS] ?? TERMS.es;

  const updated = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-24">
        <nav className="text-sm text-tinta/50 mb-8">
          <Link href={`/${locale}`} className="hover:text-tinta">{HOME_LABEL[locale] ?? HOME_LABEL.es}</Link>
          <span className="mx-2">›</span>
          <span>{terms.title}</span>
        </nav>

        <h1 className="text-4xl font-serif text-tinta mb-8">{terms.title}</h1>

        <div className="prose prose-tinta max-w-none space-y-6 text-tinta/80 leading-relaxed">
          <p><strong>{UPDATED_LABEL[locale] ?? UPDATED_LABEL.es}</strong> {updated}</p>

          {terms.sections.map((section, si) => (
            <section key={si}>
              <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">{section.t}</h2>
              {section.p.map((para, pi) => (
                <p key={pi} className={pi > 0 ? 'mt-3' : undefined}>{para}</p>
              ))}
              {section.list && (
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  {section.list.map((item, li) => (
                    <li key={li}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">Esencia Sevilla</h2>
            <p>{APARTMENT.address}</p>
            <p>
              <a href={`mailto:${APARTMENT.email}`} className="hover:text-tinta">{APARTMENT.email}</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
