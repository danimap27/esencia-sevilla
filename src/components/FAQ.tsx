'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQ_KEYS = Array.from({ length: 20 }, (_, i) => `q${i + 1}` as const);

export default function FAQ() {
  const t = useTranslations('faq');
  const [openItem, setOpenItem] = useState<string | null>('q1');
  const [search, setSearch] = useState('');

  const filteredKeys = search
    ? FAQ_KEYS.filter(key => {
        const q = t(`questions.${key}` as Parameters<typeof t>[0]).toLowerCase();
        const a = t(`questions.a${key.slice(1)}` as Parameters<typeof t>[0]).toLowerCase();
        return q.includes(search.toLowerCase()) || a.includes(search.toLowerCase());
      })
    : FAQ_KEYS;

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tinta/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="input pl-11 pr-4 py-3"
            />
          </div>
        </div>

        {filteredKeys.length === 0 ? (
          <p className="text-center text-tinta/60 py-8">No se encontraron resultados para "{search}"</p>
        ) : (
          <div className="space-y-3">
            {filteredKeys.map((qKey) => {
              const aKey = `a${qKey.slice(1)}` as const;
              const isOpen = openItem === qKey;

              return (
                <div
                  key={qKey}
                  className={cn(
                    'border rounded-2xl transition-all duration-200',
                    isOpen
                      ? 'border-terracota-200 bg-terracota-50/50'
                      : 'border-tinta/10 bg-white hover:border-terracota-200'
                  )}
                >
                  <button
                    onClick={() => setOpenItem(isOpen ? null : qKey)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-tinta">
                      {t(`questions.${qKey}` as Parameters<typeof t>[0])}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'flex-shrink-0 text-terracota-500 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <div className="h-px bg-terracota-200 mb-4" />
                      <p className="text-tinta/80 leading-relaxed">
                        {t(`questions.${aKey}` as Parameters<typeof t>[0])}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-gradient-to-br from-terracota-50 to-ocre-50 border border-terracota-100">
          <p className="text-lg font-serif mb-2">{t('noAnswer')}</p>
          <p className="text-tinta/70 mb-4">{t('contactDirect')}</p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_APARTMENT_WHATSAPP || '34658410769'}?text=${encodeURIComponent(t('whatsappMessage'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            💬 {t('whatsappCta')}
          </a>
        </div>
      </div>
    </section>
  );
}
