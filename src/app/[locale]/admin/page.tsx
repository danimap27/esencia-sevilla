'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart2, Calendar, Star, Settings, LogOut, Download, Lock, DollarSign, Users, TrendingUp, X, Plus, Check, TrendingDown, MapPin } from 'lucide-react';
import { unstable_setRequestLocale } from 'next-intl/server';
import { cn } from '@/lib/utils';
import QRCode from 'qrcode';
import { APARTMENT, UPSELLS } from '@/data/apartment';
import SightsRoutesManager from '@/components/SightsRoutesManager';

type AdminTab = 'dashboard' | 'bookings' | 'reviews' | 'revenue' | 'prices' | 'sights' | 'settings';

interface BookingRow {
  id: string;
  booking_ref: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_passport_type: string;
  guest_passport_number: string;
  guest_nationality: string;
  total_amount: number;
  status: string;
  created_at: string;
  precheckin_completed: boolean;
}

interface ReviewRow {
  id: string;
  author_name: string;
  author_avatar_url: string | null;
  rating: number;
  comment: string | null;
  source: string;
  approved: boolean;
  created_at: string;
  photos: string[];
}

interface RevenueData {
  thisMonth: number;
  lastMonth: number;
  growth: number;
  chart: Array<{ month: string; revenue: number }>;
}

export default function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

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
      const [bookingsRes, reviewsRes, revenueRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/reviews'),
        fetch('/api/admin/revenue'),
      ]);
      const bookingsData = await bookingsRes.json();
      const reviewsData = await reviewsRes.json();
      const revenueData = await revenueRes.json();
      setBookings(bookingsData.bookings || []);
      setReviews(reviewsData.reviews || []);
      setRevenue(revenueData);
    } catch {}
    setLoading(false);
  };

  const generateQR = async () => {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esenciasevilla.com'}/${locale}/guia`;
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

  const toggleReview = async (id: string, approved: boolean) => {
    await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    });
    setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r));
  };

  useEffect(() => {
    if (isAuthenticated) generateQR();
  }, [isAuthenticated]);

  const stats = {
    revenue: revenue?.thisMonth || bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.total_amount, 0),
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
            <button type="submit" className="btn-primary w-full">Acceder al panel</button>
          </form>
        </div>
      </div>
    );
  }

  const navItems: { key: AdminTab; icon: React.ComponentType<any>; label: string }[] = [
    { key: 'dashboard', icon: BarChart2, label: t('dashboard') },
    { key: 'bookings', icon: Calendar, label: t('bookings') },
    { key: 'reviews', icon: Star, label: t('reviews') },
    { key: 'revenue', icon: TrendingUp, label: 'Ingresos' },
    { key: 'prices', icon: DollarSign, label: 'Precios' },
    { key: 'sights', icon: MapPin, label: 'Sitios y Rutas' },
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
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-crema/10">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-crema/60 hover:text-crema hover:bg-crema/10"
          >
            <LogOut size={18} />{t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl">
          {/* Mobile nav */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4">
            {navItems.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap',
                  tab === key ? 'bg-terracota-500 text-white' : 'bg-white text-tinta/60 border border-tinta/10'
                )}
              >
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">{t('dashboard')}</h1>
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

              {/* Revenue growth badge */}
              {revenue && revenue.growth !== 0 && (
                <div className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6',
                  revenue.growth > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                )}>
                  {revenue.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm font-medium">
                    {revenue.growth > 0 ? '+' : ''}{revenue.growth}% vs mes anterior
                  </span>
                </div>
              )}

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
                            })}>{b.status}</span>
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

          {/* REVENUE */}
          {tab === 'revenue' && revenue && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">Ingresos</h1>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card p-5">
                  <p className="text-sm text-tinta/60 mb-2">Este mes</p>
                  <p className="text-3xl font-serif font-bold text-green-600">{revenue.thisMonth}€</p>
                </div>
                <div className="card p-5">
                  <p className="text-sm text-tinta/60 mb-2">Mes anterior</p>
                  <p className="text-3xl font-serif font-bold text-tinta">{revenue.lastMonth}€</p>
                </div>
                <div className="card p-5">
                  <p className="text-sm text-tinta/60 mb-2">Crecimiento</p>
                  <p className={cn('text-3xl font-serif font-bold', revenue.growth >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {revenue.growth > 0 ? '+' : ''}{revenue.growth}%
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="card p-6">
                <h2 className="font-semibold text-tinta mb-4">Últimos 6 meses</h2>
                <div className="flex items-end justify-between h-48 gap-2">
                  {revenue.chart.map((item, i) => {
                    const max = Math.max(...revenue.chart.map(c => c.revenue), 1);
                    const height = (item.revenue / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <span className="text-xs text-tinta/40 mb-1">{item.revenue}€</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-terracota-500 to-terracota-300 transition-all"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <span className="text-xs text-tinta/50 mt-2 capitalize">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS with pre-check-in data */}
          {tab === 'bookings' && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">{t('bookings')}</h1>
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="card overflow-hidden">
                    <button
                      onClick={() => setExpandedBooking(expandedBooking === b.id ? null : b.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-crema/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-tinta/50">{b.booking_ref}</span>
                        <span className="font-medium text-tinta">{b.guest_name || '—'}</span>
                        <span className="text-sm text-tinta/60">{b.check_in} → {b.check_out}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-terracota-600">{b.total_amount}€</span>
                        {b.precheckin_completed && (
                          <span className="badge bg-green-100 text-green-700 text-xs">✓ Pre-check</span>
                        )}
                        <span className={cn('badge text-xs', {
                          'bg-green-100 text-green-700': b.status === 'confirmed',
                          'bg-yellow-100 text-yellow-700': b.status === 'pending',
                        })}>{b.status}</span>
                      </div>
                    </button>

                    {/* Expanded pre-checkin data */}
                    {expandedBooking === b.id && b.precheckin_completed && (
                      <div className="p-4 border-t border-tinta/5 bg-crema/20">
                        <h3 className="font-medium text-tinta mb-3 text-sm">Datos de Pre-check-in</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-tinta/40">Documento</p>
                            <p className="text-tinta">{b.guest_passport_type || '—'}: {b.guest_passport_number || '—'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-tinta/40">Nacionalidad</p>
                            <p className="text-tinta">{b.guest_nationality || '—'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-tinta/40">Email</p>
                            <p className="text-tinta">{b.guest_email || '—'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-tinta/40">Teléfono</p>
                            <p className="text-tinta">{b.guest_phone || '—'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="card p-8 text-center text-tinta/40">No hay reservas todavía</div>
                )}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {tab === 'reviews' && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">{t('reviews')}</h1>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {r.author_avatar_url ? (
                          <img src={r.author_avatar_url} alt={r.author_name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-terracota-100 flex items-center justify-center font-bold text-terracota-600">
                            {r.author_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-tinta">{r.author_name}</p>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={12} fill={s <= r.rating ? 'currentColor' : 'none'} className={s <= r.rating ? 'text-ocre-400' : 'text-tinta/20'} />
                            ))}
                            <span className="text-xs text-tinta/50 ml-1">{r.source}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.approved ? (
                          <span className="badge bg-green-100 text-green-700 text-xs">Aprobada</span>
                        ) : (
                          <button
                            onClick={() => toggleReview(r.id, true)}
                            className="btn-primary text-xs px-3 py-1.5"
                          >
                            <Check size={14} className="inline mr-1" />Aprobar
                          </button>
                        )}
                        {r.approved && (
                          <button
                            onClick={() => toggleReview(r.id, false)}
                            className="text-red-500 hover:text-red-700 text-xs px-3 py-1.5"
                          >
                            <X size={14} className="inline mr-1" />Rechazar
                          </button>
                        )}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-tinta/70">{r.comment}</p>}
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="card p-8 text-center text-tinta/40">No hay reseñas pendientes</div>
                )}
              </div>
            </div>
          )}

          {/* PRICES */}
          {tab === 'prices' && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">Precios y Extras</h1>
              <div className="card p-6 mb-6">
                <h2 className="font-semibold text-tinta mb-4">Tarifas base</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-tinta/70">Precio base por noche</span>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue={APARTMENT.basePricePerNight} className="input w-24 text-right" />
                      <span className="text-tinta/40">€</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-tinta/70">Tasa de limpieza</span>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue={APARTMENT.cleaningFee} className="input w-24 text-right" />
                      <span className="text-tinta/40">€</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-tinta/70">Tasa turística / persona / noche</span>
                    <div className="flex items-center gap-2">
                      <input type="number" step="0.50" defaultValue={APARTMENT.touristTaxPerPersonNight} className="input w-24 text-right" />
                      <span className="text-tinta/40">€</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-tinta mb-4">Upsells</h2>
                <div className="space-y-4">
                  {UPSELLS.map(upsell => (
                    <div key={upsell.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{upsell.icon}</span>
                        <span className="text-sm text-tinta/70">{upsell.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={upsell.price} className="input w-24 text-right" />
                        <span className="text-tinta/40">€</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary mt-6 w-full">Guardar cambios</button>
              </div>
            </div>
          )}

          {/* SIGHTS & ROUTES */}
          {tab === 'sights' && <SightsRoutesManager />}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div>
              <h1 className="text-3xl font-serif text-tinta mb-8">{t('settings')}</h1>
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">📱 {t('qrGuide')}</h2>
                <p className="text-sm text-tinta/60 mb-4">
                  QR listo para imprimir y colocar en el apartamento. Al escanearlo, los huéspedes acceden a la guía turística completa offline.
                </p>
                {qrDataUrl && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-crema rounded-2xl border border-tinta/10">
                      <img src={qrDataUrl} alt="QR Guía Turística" className="w-48 h-48" />
                      <p className="text-center text-xs text-tinta/50 mt-3">esenciasevilla.com/{locale}/guia</p>
                    </div>
                    <button onClick={downloadQR} className="btn-primary gap-2">
                      <Download size={18} />{t('downloadQR')}
                    </button>
                  </div>
                )}
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">{t('blockDates')}</h2>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="date"
                    value={blockDate}
                    onChange={e => setBlockDate(e.target.value)}
                    className="input flex-1 min-w-[200px]"
                  />
                  <input
                    type="text"
                    value={blockReason}
                    onChange={e => setBlockReason(e.target.value)}
                    placeholder="Motivo"
                    className="input flex-1 min-w-[200px]"
                  />
                  <button
                    onClick={async () => {
                      if (!blockDate) return;
                      await fetch('/api/admin/block-date', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ date: blockDate, reason: blockReason }),
                      });
                      setBlockDate(''); setBlockReason('');
                    }}
                    className="btn-primary px-4"
                  >
                    <Plus size={18} />Bloquear
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