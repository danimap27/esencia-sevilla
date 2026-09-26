'use client';

import { useTranslations } from 'next-intl';
import { Wifi, Key, AlertTriangle, Phone, Refrigerator, Coffee, Snowflake, Tv, ShowerHead, Lightbulb, Footprints } from 'lucide-react';
import { APARTMENT, HOUSE_RULES, EMERGENCY_CONTACTS } from '@/data/apartment';
import { cn } from '@/lib/utils';

// QR code for WiFi (uses qrcode library via API or inline SVG placeholder)
function WifiQR({ ssid, password }: { ssid: string; password: string }) {
  const wifiString = `WIFI:T:WPA;S:${ssid};P:${password};;`;
  // Since we can't use qrcode in a client component easily without imports,
  // we use a data URL approach via the admin API or display manually
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-xl bg-white border-2 border-tinta/10 flex items-center justify-center text-tinta/30">
        <Wifi size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-tinta/70">{ssid}</p>
        <p className="text-lg font-mono font-bold text-tinta">{password}</p>
      </div>
    </div>
  );
}

const APPLIANCE_ICONS = [Refrigerator, Coffee, Snowflake, Tv, ShowerHead, Lightbulb];

export default function WelcomeBook() {
  const t = useTranslations('welcomeBook');
  const tBooking = useTranslations('booking');
  const tCommon = useTranslations('common');
  const tRules = useTranslations('rules');
  const tEmergency = useTranslations('emergency');

  const appliances = (t.raw('appliancesList') as { name: string; instructions: string }[])
    .map((a, i) => ({ ...a, icon: APPLIANCE_ICONS[i] ?? Refrigerator }));

  const checkoutSteps = t.raw('checkoutList') as string[];

  const recommendations = t.raw('recommendationsList') as { name: string; type: string; distance: string; note: string }[];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* WiFi Section */}
      <section className="card p-8 bg-gradient-to-br from-azulejo-50 to-white">
        <h2 className="text-2xl font-serif text-tinta mb-5 flex items-center gap-2">
          <Wifi size={24} className="text-terracota-500" /> {t('wifi')}
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <WifiQR ssid={APARTMENT.wifi} password="2025Sevilla!" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Key size={16} className="text-tinta/40" />
              <span className="text-tinta/60">{t('password')}</span>
              <span className="font-mono font-bold text-tinta">2025Sevilla!</span>
            </div>
            <p className="text-xs text-tinta/40">
              {t('wifiNote')}
            </p>
          </div>
        </div>
      </section>

      {/* Check-in / Check-out */}
      <section className="grid grid-cols-2 gap-4">
        <div className="card p-6">
          <p className="text-sm text-tinta/60 mb-1">{t('checkIn')}</p>
          <p className="text-2xl font-serif font-bold text-terracota-600">{APARTMENT.checkInTime}h</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-tinta/60 mb-1">{t('checkOut')}</p>
          <p className="text-2xl font-serif font-bold text-terracota-600">{APARTMENT.checkOutTime}h</p>
        </div>
      </section>

      {/* House rules */}
      <section className="card p-8">
        <h2 className="text-2xl font-serif text-tinta mb-5 flex items-center gap-2">
          <Footprints size={24} className="text-terracota-500" /> {t('rules')}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HOUSE_RULES.map((rule, i) => (
            <li key={i} className="flex items-center gap-3 text-tinta/80">
              <span className="text-xl">{rule.icon}</span>
              <span className="text-sm">{tRules(rule.key.replace('rules.', '') as Parameters<typeof tRules>[0])}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Appliances */}
      <section className="card p-8">
        <h2 className="text-2xl font-serif text-tinta mb-5">{t('appliances')}</h2>
        <div className="space-y-4">
          {appliances.map((app, i) => (
            <div key={i} className="flex items-start gap-4 pb-4 border-b border-tinta/5 last:border-0">
              <div className="w-10 h-10 rounded-xl bg-crema flex items-center justify-center flex-shrink-0">
                <app.icon size={20} className="text-terracota-500" />
              </div>
              <div>
                <p className="font-medium text-tinta mb-1">{app.name}</p>
                <p className="text-sm text-tinta/60 leading-relaxed">{app.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency contacts */}
      <section className="card p-8 bg-red-50/30">
        <h2 className="text-2xl font-serif text-tinta mb-5 flex items-center gap-2">
          <AlertTriangle size={24} className="text-red-500" /> {t('emergencies')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EMERGENCY_CONTACTS.map((contact, i) => (
            <a
              key={i}
              href={`tel:${contact.phone}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-tinta/10 hover:border-red-300 transition-colors"
            >
              <span className="text-xl">{contact.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-tinta">{tEmergency(contact.nameKey)}</p>
                <p className="text-xs text-tinta/50 font-mono">{contact.phone}</p>
              </div>
              <Phone size={16} className="text-red-400" />
            </a>
          ))}
        </div>
      </section>

      {/* Check-out steps */}
      <section className="card p-8">
        <h2 className="text-2xl font-serif text-tinta mb-5">{t('checkoutSteps')}</h2>
        <ol className="space-y-3">
          {checkoutSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-terracota-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-tinta/80 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Host recommendations */}
      <section className="card p-8">
        <h2 className="text-2xl font-serif text-tinta mb-5">{t('recommendations')}</h2>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start justify-between pb-3 border-b border-tinta/5 last:border-0">
              <div>
                <p className="font-medium text-tinta">{rec.name}</p>
                <p className="text-sm text-tinta/50">{rec.note}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-terracota-500 font-medium">{rec.type}</p>
                <p className="text-xs text-tinta/40">{rec.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}