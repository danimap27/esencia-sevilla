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

export default function WelcomeBook() {
  const t = useTranslations('welcomeBook');
  const tBooking = useTranslations('booking');
  const tCommon = useTranslations('common');

  const appliances = [
    { icon: Refrigerator, name: 'Nevera', instructions: 'Nevera combi: ajusta la temperatura con el panel interior. Congelador en la parte inferior.' },
    { icon: Coffee, name: 'Cafetera Nespresso', instructions: '1. Rellena el depósito de agua. 2. Insertar cápsula. 3. Pulsar botón espresso (40ml) o lungo (110ml).' },
    { icon: Snowflake, name: 'Aire Acondicionado', instructions: 'Mando a distancia en el salón. Modo Cool (nieve) a 22-24°C recomendado en verano.' },
    { icon: Tv, name: 'Smart TV', instructions: 'Mando a distancia en la mesita. Netflix/Prime Video disponibles con tu cuenta. USB disponible.' },
    { icon: ShowerHead, name: 'Calentador', instructions: 'Calentador de agua en cuarto de baño. Temperatura ajustable. Agua caliente disponible 24h.' },
    { icon: Lightbulb, name: 'Lavadora', instructions: 'Detergente en el armario. Programa Eco 40°C para uso normal (1h 20min). No usar para prendas delicadas.' },
  ];

  const checkoutSteps = [
    'Recoge todas tus pertenencias (revisa cajones, baño, armarios).',
    'Cierra ventanas y persianas.',
    'Deja las llaves en la caja de seguridad junto a la puerta.',
    'Apaga el A/C y las luces.',
    'Cierra la puerta al salir.',
  ];

  const recommendations = [
    { name: 'Bar Danubio', type: 'Bar de barrio', distance: '3 min andando', note: 'Desayunos y tapas de siempre, ambiente local.' },
    { name: 'La Rosaleda', type: 'Restaurante andaluz', distance: '4 min andando', note: 'Menú del día casero, muy popular en la zona.' },
    { name: 'Berenice Bistrot', type: 'Restaurante', distance: '2 min andando', note: 'Cocina de mercado en un local pequeño.' },
    { name: 'Alimentación La Esquinita', type: 'Ultramarinos', distance: '2 min andando', note: 'Todo lo básico para la nevera.' },
    { name: 'Panadería Polvillo', type: 'Panadería', distance: '9 min andando', note: 'Pan recién hecho y bollería.' },
    { name: 'Mercadona', type: 'Supermercado', distance: '6 min andando', note: 'Compra completa cerca de casa.' },
  ];

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
              <span className="text-tinta/60">Contraseña:</span>
              <span className="font-mono font-bold text-tinta">2025Sevilla!</span>
            </div>
            <p className="text-xs text-tinta/40">
              Fibra óptica 600 Mbps — señal 5G en toda la vivienda
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
              <span className="text-sm">No fumar · No mascotas · No fiestas</span>
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
                <p className="text-sm font-medium text-tinta">{contact.name}</p>
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