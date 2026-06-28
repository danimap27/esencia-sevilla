import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInCalendarDays, format, parseISO, addDays } from 'date-fns';
import { es, enUS, fr, de, it, pt } from 'date-fns/locale';
import { Locale } from '@/i18n';
import { APARTMENT } from '@/data/apartment';
import { PriceBreakdown } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFnsLocales: Record<Locale, Locale extends string ? object : never> = {
  es: es as object,
  en: enUS as object,
  fr: fr as object,
  de: de as object,
  it: it as object,
  pt: pt as object,
};

export function getDateLocale(locale: Locale) {
  return dateFnsLocales[locale] as Parameters<typeof format>[2] extends { locale?: infer L } ? L : never;
}

export function formatDate(date: Date | string, locale: Locale, formatStr = 'PP') {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: getDateLocale(locale) as Parameters<typeof format>[2]['locale'] });
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.max(0, differenceInCalendarDays(checkOut, checkIn));
}

export function calculatePrice(
  checkIn: Date,
  checkOut: Date,
  guests: number,
  upsellsTotal = 0,
  discountPercent = 0,
  couponDiscount = 0
): PriceBreakdown {
  const nights = calculateNights(checkIn, checkOut);
  // Dynamic pricing: each night priced according to season/events
  let subtotal = 0;
  let current = new Date(checkIn);
  for (let i = 0; i < nights; i++) {
    subtotal += getDynamicPrice(current);
    current = addDays(current, 1);
  }
  // Base price per night (average for display)
  const pricePerNight = nights > 0 ? Math.round(subtotal / nights) : APARTMENT.basePricePerNight;
  const cleaningFee = APARTMENT.cleaningFee;
  const touristTax = guests * nights * APARTMENT.touristTaxPerPersonNight;
  const discount = Math.round(subtotal * (discountPercent / 100)) + couponDiscount;
  const total = subtotal + cleaningFee + touristTax + upsellsTotal - discount;
  const bookingPrice = Math.round(total * 1.1);
  const savings = bookingPrice - total;

  return {
    nights,
    pricePerNight,
    subtotal,
    cleaningFee,
    touristTax,
    upsellsTotal,
    discount,
    total,
    bookingPrice,
    savings,
  };
}

export function getSeasonMultiplier(date: Date): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Semana Santa / Easter (late March - early April) — peak
  if ((month === 3 && day >= 25) || (month === 4 && day <= 10)) return 1.5;
  // Feria de Abril (mid-late April) — peak
  if (month === 4 && day >= 15 && day <= 30) return 1.5;
  // Summer (June-August) — high
  if (month >= 6 && month <= 8) return 1.25;
  // Christmas/NYE — high
  if (month === 12 && day >= 22) return 1.3;
  // Spring/Autumn shoulder — normal
  if ((month >= 3 && month <= 5) || (month >= 9 && month <= 11)) return 1.0;
  // Winter low — discount
  return 0.85;
}

export function getDynamicPrice(date: Date): number {
  return Math.round(APARTMENT.basePricePerNight * getSeasonMultiplier(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

export function formatPrice(amount: number, currency = 'EUR', locale = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ES-${timestamp}-${random}`;
}

export function getDaysArray(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  let current = start;
  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  return days;
}

export function isHighSeason(date: Date): boolean {
  return getSeasonMultiplier(date) > 1.0;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://esenciasevilla.com';
  return `${base}${path}`;
}
