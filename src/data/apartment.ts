import { ApartmentInfo, BookingUpsell } from '@/types';

export const APARTMENT: ApartmentInfo = {
  name: 'Esencia Sevilla',
  address: 'Imaginero Luis Álvarez Duarte 7, 41008 Sevilla, España',
  lat: 37.3968636,
  lng: -5.9742189,
  registrationNumber: 'AT/SE/03584',
  maxGuests: 4,
  bedrooms: 2,
  beds: 3,
  bathrooms: 1,
  size: '65 m²',
  wifi: 'EsenciaSevilla_5G',
  checkInTime: '16:00',
  checkOutTime: '11:00',
  phone: '+34 600 000 000',
  whatsapp: '34600000000',
  email: 'hola@esenciasevilla.com',
  basePricePerNight: 142,
  cleaningFee: 60,
  touristTaxPerPersonNight: 1.50,
};

export const UPSELLS = [
  {
    id: 'airport-transfer',
    icon: '🚗',
    price: 35,
    nameKey: 'upsells.airportTransfer',
    descKey: 'upsells.airportTransferDesc',
  },
  {
    id: 'welcome-pack',
    icon: '🧺',
    price: 25,
    nameKey: 'upsells.welcomePack',
    descKey: 'upsells.welcomePackDesc',
  },
  {
    id: 'late-checkout',
    icon: '🕐',
    price: 20,
    nameKey: 'upsells.lateCheckout',
    descKey: 'upsells.lateCheckoutDesc',
  },
  {
    id: 'travel-cot',
    icon: '🛏️',
    price: 15,
    nameKey: 'upsells.travelCot',
    descKey: 'upsells.travelCotDesc',
  },
  {
    id: 'romantic-pack',
    icon: '🌹',
    price: 45,
    nameKey: 'upsells.romanticPack',
    descKey: 'upsells.romanticPackDesc',
  },
] as const;

export const AMENITIES = [
  { icon: '📶', key: 'amenities.wifi' },
  { icon: '❄️', key: 'amenities.ac' },
  { icon: '🍳', key: 'amenities.kitchen' },
  { icon: '🫧', key: 'amenities.washer' },
  { icon: '📺', key: 'amenities.tv' },
  { icon: '☕', key: 'amenities.coffeeMaker' },
  { icon: '🏠', key: 'amenities.selfCheckin' },
  { icon: '🛗', key: 'amenities.elevator' },
] as const;

export const HOUSE_RULES = [
  { icon: '🚭', key: 'rules.noSmoking' },
  { icon: '🐾', key: 'rules.noPets' },
  { icon: '🔇', key: 'rules.quietHours' },
  { icon: '👥', key: 'rules.maxGuests' },
  { icon: '🎉', key: 'rules.noParties' },
  { icon: '🔑', key: 'rules.selfCheckin' },
] as const;

export const EMERGENCY_CONTACTS = [
  { icon: '🚨', nameKey: '112', phone: '112' },
  { icon: '👮', nameKey: 'police', phone: '091' },
  { icon: '🏥', nameKey: 'hospital', phone: '+34 955 012 000' },
  { icon: '💊', nameKey: 'pharmacy', phone: '024 (consultar)' },
  { icon: '🚕', nameKey: 'taxi', phone: '+34 954 622 222' },
  { icon: '🔧', nameKey: 'host', phone: '+34 600 000 000' },
] as const;

export const ARRIVAL_INSTRUCTIONS = {
  airport: {
    icon: '✈️',
    nameKey: 'arrival.airport',
    steps: [
      'arrival.airport.step1',
      'arrival.airport.step2',
      'arrival.airport.step3',
      'arrival.airport.step4',
    ],
  },
  train: {
    icon: '🚂',
    nameKey: 'arrival.train',
    steps: [
      'arrival.train.step1',
      'arrival.train.step2',
      'arrival.train.step3',
    ],
  },
  car: {
    icon: '🚗',
    nameKey: 'arrival.car',
    steps: [
      'arrival.car.step1',
      'arrival.car.step2',
      'arrival.car.step3',
    ],
  },
} as const;

export const NEARBY_LANDMARKS = [
  { name: 'Catedral de Sevilla', distance: '26 min a pie', icon: '⛪' },
  { name: 'La Giralda', distance: '26 min a pie', icon: '🗼' },
  { name: 'Real Alcázar', distance: '27 min a pie', icon: '🏰' },
  { name: 'Barrio de Santa Cruz', distance: '24 min a pie', icon: '🌺' },
  { name: 'Plaza de España', distance: '31 min a pie', icon: '🏛️' },
  { name: 'Archivo de Indias', distance: '26 min a pie', icon: '📚' },
  { name: 'Torre del Oro', distance: '32 min a pie', icon: '🌟' },
  { name: 'Museo de Bellas Artes', distance: '20 min a pie', icon: '🎨' },
] as const;
