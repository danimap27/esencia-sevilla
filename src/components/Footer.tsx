import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Shield, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { type Locale } from '@/i18n';
import { APARTMENT } from '@/data/apartment';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-tinta text-crema/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-terracota-500 flex items-center justify-center text-white font-serif font-bold text-sm">
                ES
              </div>
              <div>
                <p className="font-serif text-xl text-crema font-semibold">{APARTMENT.name}</p>
                <p className="text-xs text-crema/50">{t('tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-crema/60 max-w-xs leading-relaxed mb-4">
              {APARTMENT.address}
            </p>
            <div className="flex items-center gap-2 text-xs text-crema/50">
              <Shield size={12} />
              <span>{t('registrationLabel')}: {APARTMENT.registrationNumber}</span>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-crema/10 hover:bg-terracota-500 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-crema/10 hover:bg-blue-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`https://wa.me/${APARTMENT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-crema/10 hover:bg-green-600 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-crema mb-4 uppercase text-xs tracking-wider">{t('nav')}</p>
            <nav className="space-y-2.5">
              {[
                { label: t('home'), href: `/${locale}` },
                { label: t('links.blog'), href: `/${locale}/blog` },
                { label: t('links.guide'), href: `/${locale}/guia` },
                { label: 'FAQ', href: '#faq' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="block text-sm text-crema/60 hover:text-crema transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal + Contact */}
          <div>
            <p className="font-semibold text-crema mb-4 uppercase text-xs tracking-wider">{t('contact')}</p>
            <div className="space-y-2.5 text-sm text-crema/60 mb-6">
              <p>📧 <a href={`mailto:${APARTMENT.email}`} className="hover:text-crema transition-colors">{APARTMENT.email}</a></p>
              <p>📱 <a href={`tel:${APARTMENT.phone}`} className="hover:text-crema transition-colors">{APARTMENT.phone}</a></p>
              <p>💬 <a href={`https://wa.me/${APARTMENT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-crema transition-colors">WhatsApp</a></p>
            </div>

            <p className="font-semibold text-crema mb-3 uppercase text-xs tracking-wider">{t('legal')}</p>
            <nav className="space-y-2.5">
              {[
                { label: t('links.privacy'), href: `/${locale}/privacidad` },
                { label: t('links.terms'), href: `/${locale}/terminos` },
                { label: t('links.cookies'), href: '#cookies' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="block text-sm text-crema/60 hover:text-crema transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-crema/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-crema/40">
          <p>{t('copyright', { year })}</p>
          <p>{t('madeWith')} ❤️</p>
        </div>
      </div>
    </footer>
  );
}
