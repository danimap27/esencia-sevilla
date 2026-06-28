'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie, X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type CookiePreferences = {
  necessary: boolean;     // always true
  analytics: boolean;     // GA4
  marketing: boolean;     // Meta Pixel
};

const STORAGE_KEY = 'esencia-sevilla-cookie-consent';
const CONSENT_VERSION = '1.0';

export default function CookieBanner() {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else {
      try {
        const data = JSON.parse(stored);
        if (data.version !== CONSENT_VERSION) {
          setVisible(true);
        } else {
          applyScripts(data.prefs);
        }
      } catch {
        setVisible(true);
      }
    }
  }, []);

  const save = (newPrefs: CookiePreferences) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: CONSENT_VERSION, prefs: newPrefs, date: new Date().toISOString() })
    );
    applyScripts(newPrefs);
    setVisible(false);
  };

  const applyScripts = (p: CookiePreferences) => {
    // GA4
    if (p.analytics && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      if (!document.getElementById('ga-script')) {
        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga-config';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `;
        document.head.appendChild(script2);
      }
    }

    // Meta Pixel
    if (p.marketing && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      if (!document.getElementById('meta-pixel')) {
        const script = document.createElement('script');
        script.id = 'meta-pixel';
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }
    }
  };

  const handleAcceptAll = () => save({ necessary: true, analytics: true, marketing: true });
  const handleRejectAll = () => save({ necessary: true, analytics: false, marketing: false });
  const handleSavePrefs = () => save(prefs);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
      <div className="max-w-3xl mx-auto bg-tinta rounded-2xl shadow-2xl overflow-hidden border border-tinta/20">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 pb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracota-500 flex items-center justify-center flex-shrink-0">
              <Cookie size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-crema font-semibold">{t('title')}</h3>
              <p className="text-sm text-crema/70 mt-1 max-w-lg">{t('description')}</p>
            </div>
          </div>
          <button
            onClick={handleRejectAll}
            className="text-crema/40 hover:text-crema transition-colors flex-shrink-0"
            aria-label={t('close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between px-5 py-2 text-sm text-crema/60 hover:text-crema transition-colors border-t border-crema/10"
        >
          <span>{t('customize')}</span>
          <ChevronDown
            size={16}
            className={cn('transition-transform', showSettings && 'rotate-180')}
          />
        </button>

        {/* Granular settings */}
        {showSettings && (
          <div className="px-5 pb-3 space-y-2">
            {/* Necessary */}
            <div className="flex items-center justify-between py-2 border-b border-crema/10">
              <div>
                <p className="text-sm text-crema font-medium">{t('necessary')}</p>
                <p className="text-xs text-crema/50">{t('necessaryDesc')}</p>
              </div>
              <div className="w-10 h-6 bg-terracota-500 rounded-full flex items-center justify-end px-1">
                <Check size={14} className="text-white" />
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between py-2 border-b border-crema/10">
              <div>
                <p className="text-sm text-crema font-medium">{t('analytics')}</p>
                <p className="text-xs text-crema/50">{t('analyticsDesc')}</p>
              </div>
              <button
                onClick={() => setPrefs({ ...prefs, analytics: !prefs.analytics })}
                className={cn(
                  'w-10 h-6 rounded-full flex items-center transition-all duration-200',
                  prefs.analytics ? 'bg-terracota-500 justify-end' : 'bg-crema/20 justify-start'
                )}
              >
                <div className={cn('w-5 h-5 rounded-full bg-white transition-transform', prefs.analytics ? 'translate-x-0' : '-translate-x-0.5')} />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-crema font-medium">{t('marketing')}</p>
                <p className="text-xs text-crema/50">{t('marketingDesc')}</p>
              </div>
              <button
                onClick={() => setPrefs({ ...prefs, marketing: !prefs.marketing })}
                className={cn(
                  'w-10 h-6 rounded-full flex items-center transition-all duration-200',
                  prefs.marketing ? 'bg-terracota-500 justify-end' : 'bg-crema/20 justify-start'
                )}
              >
                <div className={cn('w-5 h-5 rounded-full bg-white transition-transform', prefs.marketing ? 'translate-x-0' : '-translate-x-0.5')} />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-2">
          <button
            onClick={handleAcceptAll}
            className="flex-1 bg-terracota-500 hover:bg-terracota-600 text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            {t('acceptAll')}
          </button>
          <button
            onClick={handleRejectAll}
            className="flex-1 bg-crema/10 hover:bg-crema/20 text-crema font-medium py-3 rounded-xl text-sm transition-colors border border-crema/20"
          >
            {t('rejectAll')}
          </button>
          {showSettings && (
            <button
              onClick={handleSavePrefs}
              className="flex-1 bg-ocre-500 hover:bg-ocre-600 text-tinta font-medium py-3 rounded-xl text-sm transition-colors"
            >
              {t('savePrefs')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}