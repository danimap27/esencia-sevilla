'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { es, enUS, fr, de, it, pt } from 'date-fns/locale';
import { Users, Calendar, Tag, CheckCircle, X, ExternalLink, Info, TrendingDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { type Locale } from '@/i18n';
import { APARTMENT, UPSELLS } from '@/data/apartment';
import { calculatePrice, formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const DATE_FNS_LOCALES: Record<Locale, object> = {
  es: es, en: enUS, fr: fr, de: de, it: it, pt: pt,
};

const BOOKING_COM_URL = 'https://www.booking.com/Share-Skt5m9';

interface SelectedUpsell {
  id: string;
  price: number;
  name: string;
}

export default function BookingSection() {
  const t = useTranslations('booking');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [selectedUpsells, setSelectedUpsells] = useState<SelectedUpsell[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState<'direct' | 'flexible'>('direct');

  const today = startOfToday();

  // Fetch blocked dates
  useEffect(() => {
    fetch('/api/availability')
      .then(r => r.json())
      .then(data => {
        if (data.blockedDates) {
          setBlockedDates(data.blockedDates.map((d: string) => new Date(d)));
        }
      })
      .catch(() => {
        // Fallback: seed some demo unavailable dates
        const demo: Date[] = [];
        const start = addDays(today, 5);
        for (let i = 0; i < 4; i++) demo.push(addDays(start, i));
        setBlockedDates(demo);
      });
  }, []);

  const nights = range?.from && range?.to
    ? Math.ceil((range.to.getTime() - range.from.getTime()) / 86400000)
    : 0;

  const upsellsTotal = selectedUpsells.reduce((s, u) => s + u.price, 0);
  const priceBreakdown = range?.from && range?.to
    ? calculatePrice(range.from, range.to, guests, upsellsTotal, activeTab === 'direct' ? 10 : 0, couponDiscount)
    : null;

  const toggleUpsell = (upsell: typeof UPSELLS[number]) => {
    setSelectedUpsells(prev => {
      const exists = prev.find(u => u.id === upsell.id);
      if (exists) return prev.filter(u => u.id !== upsell.id);
      return [...prev, { id: upsell.id, price: upsell.price, name: upsell.nameKey }];
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch('/api/bookings/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount(data.discountAmount || 0);
        setCouponApplied(true);
        setCouponError(false);
        toast.success(t('coupon.applied'));
      } else {
        setCouponError(true);
        setCouponApplied(false);
      }
    } catch {
      setCouponError(true);
    }
  };

  const handleBooking = async () => {
    if (!range?.from || !range?.to) {
      toast.error(t('selectDates'));
      return;
    }
    if (nights < 2) {
      toast.error(t('minStay'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn: format(range.from, 'yyyy-MM-dd'),
          checkOut: format(range.to, 'yyyy-MM-dd'),
          guests,
          upsells: selectedUpsells,
          couponCode: couponApplied ? couponCode : undefined,
          locale,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error(tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = (date: Date) => {
    if (isBefore(date, today)) return true;
    return blockedDates.some(d => d.toDateString() === date.toDateString());
  };

  return (
    <section id="reservar" className="py-16 md:py-24 bg-crema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </div>

        {/* Tab selector: Direct vs Flexible */}
        <div className="max-w-xl mx-auto mb-8 flex bg-white rounded-2xl p-1.5 shadow-card">
          <button
            onClick={() => setActiveTab('direct')}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all',
              activeTab === 'direct'
                ? 'bg-terracota-500 text-white shadow-soft'
                : 'text-tinta/60 hover:text-tinta'
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingDown size={16} />
              <span>Reserva directa (−10%)</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('flexible')}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all',
              activeTab === 'flexible'
                ? 'bg-azulejo-500 text-white shadow-soft'
                : 'text-tinta/60 hover:text-tinta'
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <ExternalLink size={16} />
              <span>{t('freeCancel')}</span>
            </div>
          </button>
        </div>

        {activeTab === 'flexible' ? (
          /* Booking.com redirect */
          <div className="max-w-2xl mx-auto card p-8 text-center">
            <div className="text-5xl mb-4">🏨</div>
            <h3 className="text-2xl font-serif mb-3">{t('freeCancel')}</h3>
            <p className="text-tinta-lighter mb-2">
              {t('nonRefundableNote')}{' '}
              <strong className="text-azulejo-500">Booking.com</strong>
            </p>
            <p className="text-sm text-tinta/50 mb-6">
              {t('approxNote')}
            </p>
            <a
              href={BOOKING_COM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex gap-2 text-base"
            >
              <ExternalLink size={18} />
              {t('bookingRedirect')}
            </a>
          </div>
        ) : (
          /* Direct booking */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Calendar + guests */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date picker */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-terracota-500" />
                  {t('selectDates')}
                </h3>
                <div className="flex justify-center overflow-x-auto">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    disabled={isDisabled}
                    locale={DATE_FNS_LOCALES[locale] as Parameters<typeof DayPicker>[0]['locale']}
                    numberOfMonths={2}
                    fromDate={today}
                    modifiersClassNames={{
                      selected: 'rdp-day_selected',
                      range_start: 'rdp-day_range_start',
                      range_end: 'rdp-day_range_end',
                      range_middle: 'rdp-day_range_middle',
                      today: 'rdp-day_today',
                    }}
                    className="text-sm"
                  />
                </div>

                {/* Selected dates summary */}
                {range?.from && range?.to && (
                  <div className="mt-4 p-3 rounded-xl bg-terracota-50 border border-terracota-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-tinta/60">{t('checkIn')}:</span>
                      <strong>{format(range.from, 'dd MMM yyyy', { locale: DATE_FNS_LOCALES[locale] as Parameters<typeof format>[2]['locale'] })}</strong>
                      <span className="text-tinta/30">→</span>
                      <span className="text-tinta/60">{t('checkOut')}:</span>
                      <strong>{format(range.to, 'dd MMM yyyy', { locale: DATE_FNS_LOCALES[locale] as Parameters<typeof format>[2]['locale'] })}</strong>
                    </div>
                    <span className="badge bg-terracota-100 text-terracota-700">
                      {nights === 1 ? t('nights', { count: nights }) : t('nightsPlural', { count: nights })}
                    </span>
                  </div>
                )}

                {nights > 0 && nights < 2 && (
                  <p className="mt-2 text-sm text-terracota-600 flex items-center gap-1.5">
                    <Info size={14} />
                    {t('minStay')}
                  </p>
                )}
              </div>

              {/* Guests */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users size={18} className="text-terracota-500" />
                  {t('guests')}
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-10 h-10 rounded-full border-2 border-tinta/20 flex items-center justify-center text-xl font-bold hover:border-terracota-500 hover:text-terracota-500 transition-colors"
                    disabled={guests <= 1}
                  >
                    −
                  </button>
                  <div className="text-center">
                    <div className="text-3xl font-serif font-bold text-tinta">{guests}</div>
                    <div className="text-sm text-tinta/60">{guests === 1 ? t('guestCount', { count: guests }) : t('guestsCount', { count: guests })}</div>
                  </div>
                  <button
                    onClick={() => setGuests(g => Math.min(APARTMENT.maxGuests, g + 1))}
                    className="w-10 h-10 rounded-full border-2 border-tinta/20 flex items-center justify-center text-xl font-bold hover:border-terracota-500 hover:text-terracota-500 transition-colors"
                    disabled={guests >= APARTMENT.maxGuests}
                  >
                    +
                  </button>
                  <span className="text-sm text-tinta/50">{t('maxGuests', { count: APARTMENT.maxGuests })}</span>
                </div>
              </div>

              {/* Upsells */}
              {priceBreakdown && nights >= 2 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('upsells.title')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {UPSELLS.map((upsell) => {
                      const isSelected = selectedUpsells.some(u => u.id === upsell.id);
                      return (
                        <button
                          key={upsell.id}
                          onClick={() => toggleUpsell(upsell)}
                          className={cn(
                            'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                            isSelected
                              ? 'border-terracota-500 bg-terracota-50'
                              : 'border-tinta/10 hover:border-terracota-300'
                          )}
                        >
                          <span className="text-2xl">{upsell.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm">{t(`upsells.${upsell.nameKey.split('.')[1]}` as Parameters<typeof t>[0])}</span>
                              <span className="text-terracota-600 font-semibold text-sm whitespace-nowrap">+{upsell.price}€</span>
                            </div>
                            <p className="text-xs text-tinta/60 mt-0.5 truncate">{t(`upsells.${upsell.descKey.split('.')[1]}` as Parameters<typeof t>[0])}</p>
                          </div>
                          {isSelected && <CheckCircle size={16} className="text-terracota-500 flex-shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Coupon */}
              {priceBreakdown && nights >= 2 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-terracota-500" />
                    {t('coupon.label')}
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(false); setCouponApplied(false); }}
                      placeholder={t('coupon.placeholder')}
                      className={cn('input flex-1', couponError && 'border-red-400 focus:ring-red-400', couponApplied && 'border-green-400')}
                    />
                    <button onClick={applyCoupon} className="btn-secondary px-4">
                      {t('coupon.apply')}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><X size={14} /> {t('coupon.invalid')}</p>}
                  {couponApplied && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle size={14} /> {t('coupon.applied')}</p>}
                </div>
              )}
            </div>

            {/* Right: Price summary + book button */}
            <div className="space-y-4">
              <div className="card p-6 sticky top-24">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-serif font-bold text-terracota-500">
                    {priceBreakdown ? `${priceBreakdown.pricePerNight * 0.9}€` : `${APARTMENT.basePricePerNight * 0.9}€`}
                  </span>
                  <span className="text-tinta/60">{t('pricePerNight')}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-tinta/50 line-through">{APARTMENT.basePricePerNight}€</span>
                  <span className="badge bg-terracota-100 text-terracota-700">−10% directo</span>
                </div>

                {priceBreakdown && nights >= 2 && (
                  <div className="space-y-2.5 border-t border-tinta/10 pt-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-tinta/70">{t('breakdown.perNight', { price: priceBreakdown.pricePerNight, nights })}</span>
                      <span>{priceBreakdown.subtotal}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-tinta/70">{t('breakdown.cleaning')}</span>
                      <span>{priceBreakdown.cleaningFee}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-tinta/70">{t('breakdown.touristTax')}</span>
                      <span>{priceBreakdown.touristTax.toFixed(2)}€</span>
                    </div>
                    {upsellsTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-tinta/70">{t('breakdown.upsells')}</span>
                        <span>{upsellsTotal}€</span>
                      </div>
                    )}
                    {priceBreakdown.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{t('breakdown.discount')}</span>
                        <span>−{priceBreakdown.discount}€</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base border-t border-tinta/10 pt-2.5">
                      <span>{t('breakdown.total')}</span>
                      <span className="text-terracota-500">{priceBreakdown.total.toFixed(2)}€</span>
                    </div>
                    {priceBreakdown.savings && priceBreakdown.savings > 0 && (
                      <div className="flex justify-between text-sm bg-terracota-50 -mx-1 px-2 py-1.5 rounded-lg">
                        <span className="text-terracota-700">{t('breakdown.savings')}</span>
                        <span className="text-terracota-700 font-bold">−{priceBreakdown.savings.toFixed(2)}€</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!range?.from || !range?.to || nights < 2 || loading}
                  className={cn(
                    'w-full btn-primary text-base py-4 mt-2',
                    (!range?.from || !range?.to || nights < 2) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> {t('processing')}</>
                  ) : priceBreakdown && nights >= 2 ? (
                    t('bookButton', { total: priceBreakdown.total.toFixed(2) })
                  ) : (
                    t('cta' as Parameters<typeof t>[0]) || 'Selecciona fechas'
                  )}
                </button>

                {/* Non-refundable notice */}
                <p className="mt-3 text-xs text-center text-terracota-600 flex items-center justify-center gap-1">
                  <Info size={12} />
                  {t('nonRefundable')}
                </p>

                {/* Booking.com alternative */}
                <div className="mt-4 pt-4 border-t border-tinta/10 text-center">
                  <p className="text-xs text-tinta/50 mb-2">{t('nonRefundableNote')} Booking.com</p>
                  <a
                    href={BOOKING_COM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-azulejo-500 hover:text-azulejo-700 font-medium"
                  >
                    <ExternalLink size={12} />
                    Ver en Booking.com (+10%)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
