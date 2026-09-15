import { Locale } from '@/i18n';

export type { Locale };

export interface Sight {
  id: string;
  name: string;
  category: 'monument' | 'neighborhood' | 'culture' | 'food' | 'nature' | 'modern' | 'fun';
  lat: number;
  lng: number;
  description: Record<Locale, string>;
  entrance: string;
  url?: string;
  image?: string;
  walkMinutes?: number;
}

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  description?: Record<Locale, string>;
  tip?: Record<Locale, string>;
  bestTime?: Record<Locale, string>;
  image?: string;
}

export interface TouristRoute {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  category: 'classic' | 'neighborhoods' | 'romantic' | 'food' | 'family' | 'culture' | 'nature' | 'shopping' | 'photos';
  duration: string;
  distance: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  stops: RouteStop[];
  image?: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: 'supermarket' | 'bar' | 'restaurant' | 'pharmacy' | 'bus' | 'atm' | 'cafe' | 'bakery' | 'tussam';
  lat: number;
  lng: number;
  address?: string;
  distance?: string;
  hours?: string;
  phone?: string;
  priceRange?: '€' | '€€' | '€€€';
  description?: Record<Locale, string>;
}

export interface BusLine {
  id: string;
  name: string;
  destinations: string[];
  frequency: string;
  price: string;
  stops?: string[];
  nearestStop: string;
}

export interface Review {
  id: string;
  author: string;
  country: string;
  countryFlag: string;
  rating: number;
  date: string;
  source: 'google' | 'booking' | 'airbnb' | 'direct';
  text: Record<Locale, string>;
  avatar?: string;
}

export interface EventLocation {
  name: string;
  address?: string;
  lat: number;
  lng: number;
}

export interface SevilleEvent {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  startDate: string;
  endDate: string;
  category: 'festival' | 'culture' | 'music' | 'sports' | 'religious' | 'gastronomy';
  image: string;
  url?: string;
  location?: EventLocation;
  isHighSeason: boolean;
}

export interface BlogPost {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  content: Record<Locale, string>;
  image: string;
  publishedAt: string;
  author: string;
  tags: string[];
  readingTime: number;
}

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentIntentId?: string;
  upsells: BookingUpsell[];
  couponCode?: string;
  discountAmount?: number;
  source: 'direct' | 'booking' | 'airbnb';
  createdAt: string;
  preCheckinCompleted?: boolean;
  preCheckinData?: PreCheckinData;
}

export interface BookingUpsell {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PreCheckinData {
  documentType: 'passport' | 'dni' | 'nie';
  documentNumber: string;
  documentExpiry: string;
  nationality: string;
  estimatedArrival: string;
  specialRequests?: string;
  guests: GuestInfo[];
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  documentType: string;
  documentNumber: string;
}

export interface PriceBreakdown {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  touristTax: number;
  upsellsTotal: number;
  discount: number;
  total: number;
  bookingPrice?: number;
  savings?: number;
}

export interface ApartmentInfo {
  name: string;
  address: string;
  lat: number;
  lng: number;
  registrationNumber: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  size: string;
  wifi: string;
  checkInTime: string;
  checkOutTime: string;
  phone: string;
  whatsapp: string;
  email: string;
  basePricePerNight: number;
  cleaningFee: number;
  touristTaxPerPersonNight: number;
}
