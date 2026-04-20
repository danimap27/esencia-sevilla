'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { locales, localeFlags, localeNames, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { key: 'gallery', href: '#galeria' },
  { key: 'booking', href: '#reservar' },
  { key: 'map', href: '#mapa' },
  { key: 'reviews', href: '#resenas' },
  { key: 'faq', href: '#faq' },
  { key: 'blog', href: '/blog' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const switchLocale = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setLangOpen(false);
    setMobileOpen(false);
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'glass border-b border-crema-dark/30 shadow-soft'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-terracota-500 flex items-center justify-center text-white font-serif text-sm font-bold">
              ES
            </div>
            <span className="font-serif text-lg font-semibold text-tinta hidden sm:block">
              Esencia Sevilla
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ key, href }) => (
              <button
                key={key}
                onClick={() => handleNavClick(href)}
                className="px-3 py-2 text-sm font-medium text-tinta/70 hover:text-tinta hover:bg-tinta/5 rounded-lg transition-colors"
              >
                {t(key as keyof typeof t)}
              </button>
            ))}
          </div>

          {/* Right side: lang + CTA */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-tinta/70 hover:text-tinta hover:bg-tinta/5 rounded-lg transition-colors"
                aria-label="Change language"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{localeFlags[locale]}</span>
                <span className="hidden sm:inline text-xs">{locale.toUpperCase()}</span>
                <ChevronDown size={14} className={cn('transition-transform', langOpen && 'rotate-180')} />
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-1 z-20 bg-white rounded-xl shadow-large border border-tinta/10 py-1 min-w-[160px] animate-scale-in">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-crema transition-colors',
                          loc === locale ? 'font-semibold text-terracota-500' : 'text-tinta'
                        )}
                      >
                        <span>{localeFlags[loc]}</span>
                        <span>{localeNames[loc]}</span>
                        {loc === locale && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-terracota-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Book CTA */}
            <button
              onClick={() => handleNavClick('#reservar')}
              className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex"
            >
              {t('bookNow')}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-tinta hover:bg-tinta/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-tinta/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 right-0 bottom-0 w-72 bg-crema shadow-large overflow-y-auto">
            <div className="p-6 space-y-1">
              {NAV_ITEMS.map(({ key, href }) => (
                <button
                  key={key}
                  onClick={() => handleNavClick(href)}
                  className="w-full text-left px-4 py-3 text-base font-medium text-tinta hover:bg-crema-dark rounded-xl transition-colors"
                >
                  {t(key as keyof typeof t)}
                </button>
              ))}

              <div className="pt-4 border-t border-tinta/10">
                <button
                  onClick={() => handleNavClick('#reservar')}
                  className="btn-primary w-full"
                >
                  {t('bookNow')}
                </button>
              </div>

              {/* Language options in mobile */}
              <div className="pt-4 border-t border-tinta/10">
                <p className="px-4 text-xs font-semibold text-tinta/50 uppercase tracking-wider mb-2">Idioma</p>
                <div className="grid grid-cols-2 gap-1">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                        loc === locale
                          ? 'bg-terracota-500 text-white font-medium'
                          : 'hover:bg-crema-dark text-tinta'
                      )}
                    >
                      <span>{localeFlags[loc]}</span>
                      <span>{localeNames[loc]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
