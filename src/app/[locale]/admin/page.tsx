'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart2, Calendar, Star, Settings, LogOut, Download, Lock, DollarSign, Users, TrendingUp, X, Plus } from 'lucide-react';
import { unstable_setRequestLocale } from 'next-intl/server';
import { cn } from '@/lib/utils';
import QRCode from 'qrcode';
import { APARTMENT } from '@/data/apartment';

type AdminTab = 'dashboard' | 'bookings' | 'calendar' | 'reviews' | 'settings';

interface BookingRow {
  id: string;
  booking_ref: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_name: string;
  guest_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const t = useTranslations('admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAuthenticated(true);
      setPasswordError(false);
      loadData();
    } else {
      setPasswordError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {}
    setLoading(false);
  };

  const generateQR = async () => {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esenciasevilla.com'}/es/guia`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: '#2B1E15', light: '#F7F0E3' },
    });
    setQrDataUrl(dataUrl);
  };

  const downloadQR = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'esencia-sevilla-qr-guia.png';
    a.click();
  };

  useEffect(() => {
    if (isAuthenticated) generateQR();
  }, [isAuthenticated]);

  // Stats mock data
  const stats = {
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.total_amount, 0),
    occupancy: 75,
    avgNight: 128,
    totalBookings: bookings.filter(b => b.status === 'confirmed').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-tinta flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-large p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-terracota-500 flex items-center justify-center text-white font-serif font-bold">ES</div>
            <div>
              <p className="font-serif text-xl font-semibold text-tinta">Panel Admin</p>
              <p className="text-sm text-tinta/50">Esencia Sevilla</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tinta mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tinta/40" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={cn('input pl-11', passwordError && 'border-red-400')}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">Contraseña incorrecta</p>}
            </div>
            <button type="submit" className="btn-primary w-full">
              Acceder al panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems: { key: AdminTab; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { key: 'dashboard', icon: BarChart2, label: t('dashboard') },
    { key: 'bookings', icon: Calendar, label: t('bookings') },
    { key: 'reviews', icon: Star, label: t('reviews') },
    { key: 'settings', icon: Settings, label: t('settings') },
  ];

  return (
    <div className="min-h-screen bg-crema flex">
      {/* Sidebar */}
      <aside className="w-64 bg-tinta text-crema flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-crema/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-terracota-500 flex items-center justify-center text-white font-serif font-bold text-sm">ES</div>
            <span className="font-serif font-semibold">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                tab === key ? 'bg-terracota-500 text-white' : 'text-crema/60 hover:text-crema hover:bg-crema/10'
              )}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-crema/10">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-crema/60 hover:text-crema hover:bg-crema/10 transition-colors"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl">
          {tab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">{t('dashboard')}</h1>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: t('revenue'), value: `${stats.revenue.toFixed(0)}€`, icon: DollarSign, color: 'text-green-600' },
                  { label: t('occupancy'), value: `${stats.occupancy}%`, icon: TrendingUp, color: 'text-azulejo-600' },
                  { label: t('avgNight'), value: `${stats.avgNight}€`, icon: BarChart2, color: 'text-terracota-600' },
                  { label: 'Reservas', value: String(stats.totalBookings), icon: Users, color: 'text-ocre-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-tinta/60">{label}</p>
                      <Icon size={18} className={color} />
                    </div>
                    <p className={`text-3xl font-serif font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Recent bookings */}
              <div className="card overflow-hidden">
                <div className="p-5 border-b border-tinta/5 flex items-center justify-between">
                  <h2 className="font-semibold text-tinta">Reservas recientes</h2>
                  <button onClick={() => setTab('bookings')} className="text-sm text-terracota-500">Ver todas →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-crema/50">
                      <tr>
                        {['Ref', 'Huésped', 'Check-in', 'Check-out', 'Total', 'Estado'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tinta/50 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-tinta/5">
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id} className="hover:bg-crema/30">
                          <td className="px-4 py-3 font-mono text-xs">{b.booking_ref}</td>
                          <td className="px-4 py-3">{b.guest_name || '—'}</td>
                          <td className="px-4 py-3">{b.check_in}</td>
                          <td className="px-4 py-3">{b.check_out}</td>
                          <td className="px-4 py-3 font-bold text-terracota-600">{b.total_amount}€</td>
                          <td className="px-4 py-3">
                            <span className={cn('badge text-xs', {
                              'bg-green-100 text-green-700': b.status === 'confirmed',
                              'bg-yellow-100 text-yellow-700': b.status === 'pending',
                              'bg-red-100 text-red-700': b.status === 'cancelled',
                              'bg-blue-100 text-blue-700': b.status === 'completed',
                            })}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-tinta/40">No hay reservas todavía</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">{t('settings')}</h1>

              {/* QR Code section */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  📱 {t('qrGuide')}
                </h2>
                <p className="text-sm text-tinta/60 mb-4">
                  QR listo para imprimir y colocar en el apartamento. Al escanearlo, los huéspedes acceden a la guía turística completa offline.
                </p>

                {qrDataUrl && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-crema rounded-2xl border border-tinta/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrDataUrl} alt="QR Guía Turística" className="w-48 h-48" />
                      <p className="text-center text-xs text-tinta/50 mt-3">esenciasevilla.com/es/guia</p>
                    </div>
                    <button onClick={downloadQR} className="btn-primary gap-2">
                      <Download size={18} />
                      {t('downloadQR')}
                    </button>
                  </div>
                )}
              </div>

              {/* Block dates */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">{t('blockDates')}</h2>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={blockDate}
                    onChange={e => setBlockDate(e.target.value)}
                    className="input flex-1"
                  />
                  <input
                    type="text"
                    value={blockReason}
                    onChange={e => setBlockReason(e.target.value)}
                    placeholder="Motivo (mantenimiento, vacaciones...)"
                    className="input flex-2"
                  />
                  <button
                    onClick={async () => {
                      if (!blockDate) return;
                      await fetch('/api/admin/block-date', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ date: blockDate, reason: blockReason }),
                      });
                      setBlockDate('');
                      setBlockReason('');
                    }}
                    className="btn-primary px-4"
                  >
                    <Plus size={18} />
                    Bloquear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
