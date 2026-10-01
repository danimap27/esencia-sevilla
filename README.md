# Esencia Sevilla — Plataforma Web para Apartamentos Turísticos

> Plataforma completa, multilingüe (6 idiomas) y responsive para la gestión, marketing y comunicación de apartamentos turísticos.
> Construida con Next.js 14, Supabase, Stripe, OpenRouter y Leaflet.

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green)](LICENSE)

---

## 📋 Índice

1. [Visión general](#-visión-general)
2. [Demo online](#-demo-online)
3. [Características completas](#-características-completas)
4. [Stack tecnológico](#-stack-tecnológico)
5. [Inicio rápido (5 minutos)](#-inicio-rápido-5-minutos)
6. [Estructura del proyecto](#-estructura-del-proyecto)
7. [Guía de adaptación: crear un nuevo apartamento](#-guía-de-adaptación-crear-un-nuevo-apartamento)
8. [Configuración de servicios externos](#-configuración-de-servicios-externos)
9. [Schema de base de datos](#-schema-de-base-de-datos)
10. [Variables de entorno](#-variables-de-entorno)
11. [Despliegue en Vercel](#-despliegue-en-vercel)
12. [Despliegue en VPS (Hostalia)](#-despliegue-en-vps-hostalia)
13. [Guía de personalización visual](#-guía-de-personalización-visual)
14. [Sistema de i18n (6 idiomas)](#-sistema-de-i18n-6-idiomas)
15. [API Routes](#-api-routes)
16. [SEO y datos estructurados](#-seo-y-datos-estructurados)
17. [Mantenimiento y actualización](#-mantenimiento-y-actualización)
18. [Checklist post-despliegue](#-checklist-post-despliegue)
19. [FAQ técnica](#-faq-técnica)

---

## 🎯 Visión general

Esencia Sevilla es una plataforma web completa diseñada específicamente para **apartamentos turísticos individuales**. Cubre todo el ciclo: marketing (landing SEO), reservas directas (Stripe), gestión (panel propietario), experiencia del huésped (pre-checkin, libro de bienvenida, guía offline) y comunicación (chat IA, WhatsApp).

El proyecto está **parametrizado para que cualquier persona pueda adaptarlo a un nuevo apartamento turístico** sin tocar la lógica de negocio. Solo necesita editar datos, fotos y variables de entorno.

### Qué incluye

| Módulo | Descripción |
|--------|-------------|
| 🏠 Landing | Hero con carrusel, comparador con Booking, tour 360°, galería |
| 📅 Reservas | Calendario iCal, precio dinámico, Stripe, upsells, cupones |
| 🧳 Pre-checkin | Formulario multi-huésped, datos SES.HOSPEDERIA |
| 📖 Libro de bienvenida | WiFi, electrodomésticos, normas, emergencias, recomendaciones |
| ⭐ Reseñas | Feed importado + moderación desde panel |
| 🗓️ Eventos | Agenda cultural + widget meteorológico Open-Meteo |
| 🤖 Chat IA | Asistente multilingüe con OpenRouter |
| 🗺️ Mapa | Leaflet con rutas a pie, POIs y transporte TUSSAM |
| 📱 Guía QR | Página offline-first accesible por QR físico |
| 👨‍💼 Panel admin | Dashboard, reservas, reseñas, ingresos, precios, settings |
| 📝 Blog | 5 artículos evergreen con schema Article |
| 🔐 Legal | Cookie banner RGPD granular + política de privacidad |
| 🗺️ Sitios y Rutas | **Gestión visual de POIs y rutas a pie desde el panel admin** |

---

## 🌐 Demo online

- **Web:** https://esenciasevilla.com (o https://esenciasevilla.quantum-homelab.win)
- **Guía QR:** https://esenciasevilla.com/es/guia
- **Panel admin:** https://esenciasevilla.com/es/admin
- **Blog:** https://esenciasevilla.com/es/blog
- **Pre-checkin:** https://esenciasevilla.com/es/pre-checkin
- **Libro de bienvenida:** https://esenciasevilla.com/es/welcome-book

---

## ✨ Características completas

### Landing / Home

- **Hero** con carrusel automático de 5 fotos, badges de confianza, rating, ahorro dinámico vs Booking y número de registro turístico
- **Comparador visual** lado a lado con Booking.com (precio, cancelación, comunicación, extras, check-in)
- **Tour virtual 360°** con Pannellum (4 escenas: salón, dormitorio, cocina, baño)
- **Galería** completa con lazy loading y fullscreen
- **Sección de reservas** con calendario interactivo, precio dinámico por temporada y eventos, upsells opcionales, cupones y pago Stripe
- **Mapa interactivo** con rutas a pie predefinidas, POIs categorizados y guía de transporte
- **Eventos** de Sevilla con widget meteorológico en tiempo real (Open-Meteo, gratuito)
- **Reseñas** importadas de Google/Booking + propias
- **FAQ** con 20 preguntas, buscador y schema FAQPage
- **Chat IA** flotante multilingüe (OpenRouter)

### Sistema de reservas dual

- **Opción A (directa):** 10% más barata, no reembolsable, pago por Stripe (tarjeta, Apple Pay, Google Pay)
- **Opción B (Booking):** botón de redirección con cancelación gratuita
- **Precio dinámico:** cada noche se pricinga según temporada (Semana Santa +50%, Feria +50%, verano +25%, Navidad +30%, invierno -15%)
- **Upsells:** traslado aeropuerto, pack bienvenida, late check-out, cuna, pack romántico
- **Cupones:** códigos promocionales gestionados desde Stripe
- **Sincronización iCal:** con Booking.com y Airbnb para evitar dobles reservas

### Portal del huésped

- **Pre-check-in online:** formulario multi-huésped con documento (DNI/pasaporte/NIE), nacionalidad, fecha de nacimiento, hora estimada de llegada y necesidades especiales
- **Datos SES.HOSPEDERIA:** generación automática del parte de viajeros para Guardia Civil/Policía Nacional
- **Cuenta regresiva personalizada:** "Faltan X días para tu estancia"
- **WhatsApp automático:** confirmación, recordatorio 3 días antes, código de acceso día del check-in, agradecimiento + reseña día del check-out

### Guía QR offline

- Página independiente accesible por QR físico impreso en el apartamento
- **PWA offline-first:** todo se cachea al primer acceso, funciona sin datos móviles
- Selector de idioma prominente al entrar (6 idiomas)
- Mapa interactivo, transporte, restaurantes, eventos, emergencias, normas, check-out
- Chat IA disponible también offline (responde al reconectar)
- Widget meteorológico

### Panel de propietario

- **Dashboard:** ingresos del mes, ocupación, precio medio/noche, total reservas, growth % vs mes anterior
- **Reservas:** listado expandible con datos de pre-checkin de cada huésped
- **Reseñas:** aprobación/rechazo de reseñas nativas
- **Ingresos:** chart de barras con últimos 6 meses + comparativa mensual
- **Precios:** edición de tarifas base y upsells
- **Settings:** QR descargable en alta resolución + bloqueo de fechas (mantenimiento, vacaciones)

---

## 🛠 Stack tecnológico

| Capa | Tecnología | Coste |
|------|-----------|-------|
| Framework | Next.js 14 (App Router) | Gratuito |
| Lenguaje | TypeScript 5 | Gratuito |
| Estilos | Tailwind CSS 3 | Gratuito |
| Base de datos | Supabase (PostgreSQL) | Free tier 500MB |
| Auth | Supabase Auth (cookie-based) | Gratuito |
| Pagos | Stripe Checkout + Webhooks | 1.4% + 0.25€ por transacción |
| Chat IA | OpenRouter API | ~0.001€ por mensaje |
| Emails | Resend | 3,000/mes gratis |
| WhatsApp | Twilio WhatsApp API | ~0.006€ por mensaje |
| Mapas | Leaflet.js + OpenStreetMap | Gratuito |
| Tour 360° | Pannellum | Gratuito (CDN) |
| Meteorología | Open-Meteo API | Gratuito (sin API key) |
| Calendario | React Day Picker | Gratuito |
| iCal sync | ical.js | Gratuito |
| i18n | next-intl | Gratuito |
| PWA | next-pwa (Workbox) | Gratuito |
| Hosting | Vercel | Free tier (100GB bandwidth) |
| Analytics | Google Analytics 4 | Gratuito |
| Pixel | Meta Pixel | Gratuito |

**Coste mensual estimado:** ~0€ para 1 apartamento con <100 reservas/mes (todo en free tiers)

---

## 🚀 Inicio rápido (5 minutos)

```bash
# 1. Clonar el repositorio
git clone https://github.com/danimap27/esencia-sevilla.git
cd esencia-sevilla

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local

# 4. Editar .env.local con tus claves (mínimo: Supabase + Stripe)
#    Ver sección "Variables de entorno" más abajo

# 5. Arrancar en modo desarrollo
npm run dev
```

La web estará en `http://localhost:3000` → redirige automáticamente a `/es`.

> **Nota:** Las APIs de Stripe, OpenRouter y Twilio fallarán si no están configuradas, pero la web se renderiza correctamente. Supabase es necesario para el calendario y reservas.

---

## 📂 Estructura del proyecto

```
esencia-sevilla/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fuentes, manifest, theme-color)
│   │   ├── globals.css               # Estilos globales + Tailwind
│   │   ├── robots.ts                 # robots.txt dinámico
│   │   ├── sitemap.ts               # sitemap.xml dinámico (6 idiomas + blog)
│   │   ├── [locale]/                 # Rutas con prefijo de idioma
│   │   │   ├── layout.tsx            # Layout i18n + CookieBanner + Toaster
│   │   │   ├── page.tsx              # Home/Landing (Hero + Comparador + Galería + Tour360 + Reservas + Mapa + Eventos + Reseñas + Ubicación + FAQ)
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # Listado de artículos
│   │   │   │   └── [slug]/page.tsx   # Artículo individual + schema Article
│   │   │   ├── guia/page.tsx         # Guía QR offline-first
│   │   │   ├── admin/page.tsx        # Panel propietario (6 tabs)
│   │   │   ├── pre-checkin/page.tsx  # Portal huésped pre-checkin
│   │   │   ├── welcome-book/page.tsx # Libro de bienvenida digital
│   │   │   └── privacidad/page.tsx   # Política de privacidad RGPD
│   │   └── api/                      # API Routes (14 endpoints)
│   │       ├── availability/         # Disponibilidad (Supabase + iCal sync)
│   │       ├── bookings/
│   │       │   ├── checkout/         # Crear sesión Stripe Checkout
│   │       │   └── validate-coupon/  # Validar cupón Stripe
│   │       ├── chat/                 # Chat IA OpenRouter
│   │       ├── weather/              # Proxy Open-Meteo
│   │       ├── pre-checkin/          # Submit pre-checkin a Supabase
│   │       ├── whatsapp/send/        # Enviar WhatsApp Twilio
│   │       ├── webhooks/stripe/      # Webhook Stripe (confirmar pago)
│   │       └── admin/
│   │           ├── auth/             # Login admin (cookie)
│   │           ├── bookings/         # Listar reservas
│   │           ├── reviews/          # Listar/moderar reseñas
│   │           ├── prices/           # Leer/editar precios
│   │           ├── revenue/          # Estadísticas ingresos
│   │           └── block-date/       # Bloquear fechas
│   ├── components/                   # 20 componentes React
│   │   ├── BookingComparison.tsx     # Tabla comparativa con Booking
│   │   ├── BookingSection.tsx        # Sistema de reservas completo
│   │   ├── ChatWidget.tsx            # Chat IA flotante
│   │   ├── CookieBanner.tsx          # Banner cookies RGPD granular
│   │   ├── EventsSection.tsx         # Eventos + weather widget
│   │   ├── FAQ.tsx                   # FAQ acordeón + buscador
│   │   ├── Footer.tsx                # Footer con links legales
│   │   ├── Gallery.tsx              # Galería fotos fullscreen
│   │   ├── GuestCountdown.tsx        # Cuenta regresiva huésped
│   │   ├── Header.tsx               # Navegación + selector idioma
│   │   ├── Hero.tsx                 # Hero con carrusel + savings
│   │   ├── LocationSection.tsx      # Ubicación + instrucciones llegada
│   │   ├── MapSection.tsx           # Mapa Leaflet (rutas + POIs + transporte)
│   │   ├── PreCheckinForm.tsx       # Formulario pre-checkin multi-huésped
│   │   ├── Reviews.tsx              # Feed de reseñas
│   │   ├── VirtualTour.tsx           # Tour 360° Pannellum
│   │   ├── WeatherWidget.tsx         # Widget meteorológico
│   │   └── WelcomeBook.tsx          # Libro de bienvenida digital
│   ├── data/                         # Datos estáticos editables
│   │   ├── apartment.ts              # ⭐ CONFIG PRINCIPAL DEL APARTAMENTO
│   │   ├── routes.ts                 # Rutas a pie predefinidas
│   │   ├── sights.ts                 # Puntos de interés del mapa
│   │   ├── events.ts                 # Eventos culturales
│   │   ├── reviews.ts                # Reseñas importadas
│   │   └── blog-posts.ts             # Artículos del blog
│   ├── lib/                          # Lógica de negocio
│   │   ├── supabase.ts               # Cliente Supabase
│   │   ├── stripe.ts                 # Cliente Stripe
│   │   ├── twilio.ts                 # Cliente WhatsApp Twilio + templates
│   │   └── utils.ts                  # Utils: precio, fechas, i18n, URLs
│   ├── types/index.ts                # Tipos TypeScript
│   └── i18n.ts                       # Config next-intl (6 idiomas)
├── messages/                         # Traducciones (6 archivos)
│   ├── es.json                       # Español (427 líneas)
│   ├── en.json                       # Inglés
│   ├── fr.json                       # Francés
│   ├── de.json                       # Alemán
│   ├── it.json                       # Italiano
│   └── pt.json                       # Portugués
├── public/                           # Assets estáticos
│   ├── fotos/                        # Fotos del apartamento (foto1-foto12.jpg)
│   ├── tours-360/                    # Fotos equirectangulares 360°
│   ├── icons/                        # Iconos PWA (72-512px)
│   ├── manifest.json                 # PWA manifest
│   └── favicon.ico
├── .env.example                      # Template variables de entorno
├── .gitignore                        # Excluye .env.local, .next, sw.js
├── next.config.mjs                   # Config Next.js + PWA + i18n
├── tailwind.config.ts                # ⭐ Config colores tema + fuentes
├── package.json                      # Dependencias
└── DEPLOY.md                         # Guía deploy detallada
```

---

## 🏗 Guía de adaptación: crear un nuevo apartamento

> **Objetivo:** transformar "Esencia Sevilla" en "Mi Apartamento" sin tocar la lógica de negocio.

### Paso 1: Datos del apartamento

Editar `src/data/apartment.ts`:

```typescript
export const APARTMENT: ApartmentInfo = {
  name: 'Mi Apartamento',                           // ← Nombre
  address: 'Calle Ejemplo 42, 28001 Madrid',        // ← Dirección
  lat: 40.4168,                                     // ← Latitud (Google Maps)
  lng: -3.7038,                                     // ← Longitud
  registrationNumber: 'AT/M/XXXXX',                 // ← Registro turístico
  maxGuests: 6,                                     // ← Capacidad
  bedrooms: 3,                                      // ← Habitaciones
  beds: 4,                                          // ← Camas
  bathrooms: 2,                                     // ← Baños
  size: '85 m²',                                    // ← Superficie
  wifi: 'MiApartamento_WiFi',                       // ← Nombre red WiFi
  checkInTime: '15:00',                             // ← Check-in
  checkOutTime: '10:00',                            // ← Check-out
  phone: '+34 600 000 000',                         // ← Teléfono
  whatsapp: '34600000000',                          // ← WhatsApp (sin +)
  email: 'hola@miapartamento.com',                  // ← Email
  basePricePerNight: 120,                           // ← Precio base/noche
  cleaningFee: 50,                                  // ← Tasa limpieza
  touristTaxPerPersonNight: 0,                      // ← Tasa turística (0 si no aplica)
};
```

También edita los arrays en el mismo archivo:
- `UPSELLS`: extras opcionales (precio, icono, nombre)
- `AMENITIES`: servicios incluidos
- `HOUSE_RULES`: normas de la casa
- `EMERGENCY_CONTACTS`: teléfonos de emergencia
- `ARRIVAL_INSTRUCTIONS`: instrucciones de llegada (aeropuerto, tren, coche)
- `NEARBY_LANDMARKS`: referencias de distancia a monumentos

### Paso 2: Fotos

1. Sube tus fotos a `public/fotos/` con nombres `foto1.jpg` a `fotoN.jpg` (mínimo 5, recomendado 12)
2. Formato: JPEG o WebP, resolución mínimo 1920x1080
3. El Hero usa `foto1` a `foto5`. La galería usa todas.

### Paso 3: Tour 360° (opcional)

1. Sube fotos equirectangulares 360° a `public/tours-360/`
2. Nombres esperados: `salon.jpg`, `dormitorio.jpg`, `cocina.jpg`, `bano.jpg`
3. Si no subes fotos, el botón del tour aparece pero muestra un mensaje de "subir fotos"
4. Puedes añadir más escenas editando `TOUR_SCENES` en `src/components/VirtualTour.tsx`

### Paso 4: Puntos de interés del mapa

Editar `src/data/sights.ts`:

```typescript
export const SIGHTS: Sight[] = [
  {
    id: 'mi-monumento',
    name: 'Nombre del Monumento',
    category: 'monument',        // monument | neighborhood | culture | food | nature | modern | fun
    lat: 40.4168,
    lng: -3.7038,
    description: {
      es: 'Descripción en español',
      en: 'English description',
      fr: 'Description en français',
      de: 'Deutsche Beschreibung',
      it: 'Descrizione italiana',
      pt: 'Descrição portuguesa',
    },
    entrance: '5€',               // o 'Entrada libre'
    url: 'https://...',           // web oficial (opcional)
    image: 'https://...',         // imagen (opcional)
    walkMinutes: 10,              // minutos andando desde el apartamento
  },
  // ... más POIs
];
```

### Paso 5: Rutas a pie

Editar `src/data/routes.ts`:

```typescript
export const ROUTES: TouristRoute[] = [
  {
    id: 'ruta-centro',
    title: { es: 'Ruta del Centro', en: 'Center Route', /* ... */ },
    description: { es: '...', en: '...', /* ... */ },
    category: 'classic',         // classic | neighborhoods | romantic | food | family | culture | nature | shopping | photos
    duration: '2h',
    distance: '3.5 km',
    difficulty: 'easy',           // easy | moderate | hard
    stops: [
      { name: 'Plaza Mayor', lat: 40.4168, lng: -3.7038, description: { es: '...', en: '...' } },
      // ... más paradas
    ],
  },
];
```

### Paso 6: Lugares cercanos (supermercados, bares, farmacias)

Editar `src/data/sights.ts` → buscar `NEARBY_PLACES`:

```typescript
export const NEARBY_PLACES: NearbyPlace[] = [
  {
    id: 'super-1',
    name: 'Supermercado Express',
    category: 'supermarket',      // supermarket | bar | restaurant | pharmacy | bus | atm | cafe | bakery
    lat: 40.4170,
    lng: -3.7040,
    distance: '2 min andando',
    hours: 'L-D 8:00-22:00',
    priceRange: '€',               // € | €€ | €€€ (solo restaurantes/bares)
  },
];
```

### Paso 7: Líneas de autobús

Editar `src/data/sights.ts` → buscar `BUS_LINES`:

```typescript
export const BUS_LINES: BusLine[] = [
  {
    id: 'line-1',
    name: 'Línea 1',
    destinations: ['Centro', 'Hospital'],
    frequency: 'Cada 10 min',
    price: '1.40€',
    nearestStop: 'Parada Calle Ejemplo',
  },
];
```

### Paso 8: Eventos culturales

Editar `src/data/events.ts`:

```typescript
export const SEVILLE_EVENTS: SevilleEvent[] = [
  {
    id: 'mi-evento-2026',
    title: { es: 'Festival de la Ciudad', en: 'City Festival', /* ... */ },
    description: { es: '...', en: '...', /* ... */ },
    startDate: '2026-07-15',
    endDate: '2026-07-20',
    category: 'festival',         // festival | culture | music | sports | religious | gastronomy
    image: 'https://...',
    url: 'https://...',
    isHighSeason: true,           // activa badge "temporada alta"
  },
];
```

### Paso 9: Reseñas

Editar `src/data/reviews.ts`:

```typescript
export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'María G.',
    country: 'España',
    countryFlag: '🇪🇸',
    rating: 5,
    date: '2025-09-15',
    source: 'google',              // google | booking | airbnb | direct
    text: {
      es: 'Estancia perfecta...',
      en: 'Perfect stay...',
      // ... 6 idiomas
    },
    avatar: 'https://...',         // opcional
  },
];
```

### Paso 10: Blog (opcional)

Editar `src/data/blog-posts.ts`:

```typescript
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'que-ver-en-mi-ciudad',
    title: { es: '...', en: '...', fr: '...' },
    description: { es: '...', en: '...', fr: '...' },
    content: {
      es: '# Markdown content...',
      en: '# Markdown content...',
      fr: '# Markdown content...',
    },
    image: 'https://...',
    publishedAt: '2026-01-15',
    author: 'Tu Nombre',
    tags: ['guia', 'ciudad'],
    readingTime: 8,                // minutos estimados
  },
];
```

> **Nota:** El blog usa markdown básico renderizado en servidor. Soporta: `#`, `##`, `###`, `- listas`, `**bold**` y párrafos.

### Paso 11: System Prompt del Chatbot

Editar `src/app/api/chat/route.ts` → constante `SYSTEM_PROMPT`:

Adapta la descripción del apartamento, ubicación, normas, servicios, recomendaciones y FAQ a tu ciudad y apartamento.

### Paso 12: Variables de entorno

Editar `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://miapartamento.com
NEXT_PUBLIC_APARTMENT_NAME="Mi Apartamento"
NEXT_PUBLIC_APARTMENT_ADDRESS="Calle Ejemplo 42, 28001 Madrid"
NEXT_PUBLIC_APARTMENT_LAT=40.4168
NEXT_PUBLIC_APARTMENT_LNG=-3.7038
NEXT_PUBLIC_REGISTRATION_NUMBER=AT/M/XXXXX
NEXT_PUBLIC_BASE_PRICE_PER_NIGHT=120
# ... resto de variables
```

### Paso 13: Libro de bienvenida

Editar `src/components/WelcomeBook.tsx`:
- Cambiar el array `appliances` con las instrucciones de tus electrodomésticos
- Cambiar `checkoutSteps` con tus pasos de check-out
- Cambiar `recommendations` con tus restaurantes recomendados

### Resumen: qué editar para un nuevo apartamento

| Archivo | Qué contiene | Esfuerzo |
|---------|-------------|----------|
| `src/data/apartment.ts` | Datos principales, upsells, normas, emergencias | 15 min |
| `.env.local` | URL, coordenadas, precio, registro | 5 min |
| `public/fotos/` | Fotos del apartamento | 30 min |
| `public/tours-360/` | Fotos 360° (opcional) | 30 min |
| `src/data/sights.ts` | POIs, lugares cercanos, buses | 1-2h |
| `src/data/routes.ts` | Rutas a pie | 1h |
| `src/data/events.ts` | Eventos culturales | 30 min |
| `src/data/reviews.ts` | Reseñas | 15 min |
| `src/data/blog-posts.ts` | Blog (opcional) | 2-3h |
| `src/app/api/chat/route.ts` | System prompt chatbot | 15 min |
| `src/components/WelcomeBook.tsx` | Libro de bienvenida | 30 min |
| `messages/*.json` | Traducciones (si añades claves nuevas) | Variable |
| `tailwind.config.ts` | Colores del tema (opcional) | 10 min |

**Total estimado:** 4-8 horas para un nuevo apartamento funcional.

---

## 🔧 Configuración de servicios externos

### Supabase (gratuito)

1. Crea cuenta en [supabase.com](https://supabase.com)
2. **New Project** → nombre, región (Europa)
3. Ve a **Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (⚠️ server only, nunca expuesta)
4. Ve a **SQL Editor** y ejecuta el SQL del apartado "Schema de base de datos"

### Stripe

1. Crea cuenta en [stripe.com](https://stripe.com)
2. **Developers → API Keys**:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Publishable key (pk_...)
   - `STRIPE_SECRET_KEY` = Secret key (sk_...)
3. **Developers → Webhooks → Add endpoint**:
   - URL: `https://tudominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `payment_intent.payment_failed`
   - `STRIPE_WEBHOOK_SECRET` = Signing secret (whsec_...)

### OpenRouter (Chat IA)

1. Crea cuenta en [openrouter.ai](https://openrouter.ai)
2. **Keys → Create Key**:
   - `OPENROUTER_API_KEY` = sk-or-v1-...
3. Elige modelo en `OPENROUTER_MODEL` (recomendado: `anthropic/claude-3-haiku` o `mistralai/mistral-7b-instruct`)

### Resend (emails)

1. Crea cuenta en [resend.com](https://resend.com)
2. **API Keys → Create API Key**:
   - `RESEND_API_KEY` = re_...
3. Verifica tu dominio en **Domains**
4. `RESEND_FROM_EMAIL` = reservas@tudominio.com

### Twilio (WhatsApp, opcional)

1. Crea cuenta en [twilio.com](https://twilio.com)
2. **Console → Account SID y Auth Token**:
   - `TWILIO_ACCOUNT_SID` = AC...
   - `TWILIO_AUTH_TOKEN` = ...
3. Activa **WhatsApp Business API** (sandbox o número aprobado)
4. `TWILIO_WHATSAPP_FROM` = whatsapp:+141...
5. `OWNER_WHATSAPP` = whatsapp:+346...

### iCal sync (Booking.com + Airbnb)

- **Booking:** Admin → Configuración → Calendario → Exportar → copia URL iCal
- **Airbnb:** Calendario → Exportar calendario → copia URL .ics
- Configura `ICAL_BOOKING_URL` e `ICAL_AIRBNB_URL` en `.env.local`

---

## 🗄 Schema de base de datos

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- ============================================
-- TABLA: bookings (reservas)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  guest_name TEXT,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  guest_passport_type TEXT,         -- 'dni' | 'passport' | 'nie'
  guest_passport_number TEXT,
  guest_nationality TEXT,
  guest_birthdate DATE,
  estimated_arrival_time TEXT,
  special_needs TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',     -- pending | confirmed | cancelled | completed
  stripe_payment_intent_id TEXT,
  upsells JSONB DEFAULT '[]',
  coupon_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  source TEXT DEFAULT 'direct',      -- direct | booking | airbnb
  precheckin_completed BOOLEAN DEFAULT false,
  precheckin_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLA: reviews (reseñas nativas)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'direct',     -- direct | google | booking
  external_id TEXT,
  stay_date DATE,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  locale TEXT DEFAULT 'es'
);

-- ============================================
-- TABLA: blocked_dates (fechas bloqueadas manualmente)
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_dates (
  date DATE PRIMARY KEY,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLA: settings (configuración dinámica)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "reviews_read_approved" ON reviews
  FOR SELECT USING (approved = true);
CREATE POLICY "blocked_dates_read" ON blocked_dates
  FOR SELECT USING (true);
-- Nota: las operaciones de escritura se hacen con service_role_key (server-side)
```

---

## 🔑 Variables de entorno

Archivo `.env.example` completo:

```bash
# --- APP ---
NEXT_PUBLIC_SITE_URL=https://esenciasevilla.com
NEXT_PUBLIC_SITE_NAME="Esencia Sevilla"

# --- SUPABASE ---
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# --- STRIPE ---
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# --- OPENROUTER (Chat IA) ---
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=anthropic/claude-3-haiku

# --- RESEND (Emails) ---
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=reservas@esenciasevilla.com
RESEND_FROM_NAME="Esencia Sevilla"

# --- TWILIO (WhatsApp) ---
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+141...
OWNER_WHATSAPP=whatsapp:+346...

# --- ICAL SYNC ---
ICAL_BOOKING_URL=https://admin.booking.com/...
ICAL_AIRBNB_URL=https://www.airbnb.com/calendar/ical/...

# --- ANALYTICS ---
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXX

# --- GOOGLE SEARCH CONSOLE ---
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxxxxxxxxx

# --- APARTAMENTO ---
NEXT_PUBLIC_APARTMENT_NAME="Esencia Sevilla"
NEXT_PUBLIC_APARTMENT_ADDRESS="Imaginero Luis Alvarez Duarte N7, 41008 Sevilla"
NEXT_PUBLIC_APARTMENT_LAT=37.3886
NEXT_PUBLIC_APARTMENT_LNG=-5.9823
NEXT_PUBLIC_APARTMENT_PHONE=+34600000000
NEXT_PUBLIC_APARTMENT_WHATSAPP=34600000000
NEXT_PUBLIC_APARTMENT_EMAIL=hola@esenciasevilla.com
NEXT_PUBLIC_REGISTRATION_NUMBER=AT/SE/03584
NEXT_PUBLIC_BASE_PRICE_PER_NIGHT=142
NEXT_PUBLIC_CLEANING_FEE=60
NEXT_PUBLIC_TOURIST_TAX=1.50
NEXT_PUBLIC_MAX_GUESTS=4

# --- ADMIN ---
ADMIN_PASSWORD=cambia_esta_contraseña

# --- REVALIDATION ---
REVALIDATION_SECRET=un_secreto_aleatorio
```

> ⚠️ **NUNCA** subas `.env.local` a git. Está en `.gitignore`.

---

## 🚢 Despliegue en Vercel

1. **Fork** el repositorio a tu GitHub
2. En [vercel.com](https://vercel.com), **New Project** → selecciona el repo
3. **Settings → Environment Variables**: añade todas las variables de `.env.example`
4. **Deploy**
5. Configura tu dominio en **Settings → Domains** (ej: `miapartamento.com`)
6. Configura el webhook de Stripe con la URL de producción

### Despliegue alternativo: Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🖥 Despliegue en VPS (Hostalia)

Tutorial completo paso a paso: **[DEPLOY-VPS.md](DEPLOY-VPS.md)**.

Resumen: Ubuntu + Node 20 + PM2 (`ecosystem.config.js` incluido) + Nginx reverse proxy + SSL con Certbot, con el dominio apuntando al VPS por registro A en el panel de Hostalia. Incluye webhook de Stripe, actualizaciones con `git pull`, troubleshooting y checklist.

> ⚠️ El hosting compartido con cPanel de Hostalia **no sirve** para Next.js: hace falta un VPS (o Cloud) con SSH y acceso root.

---

## 🎨 Guía de personalización visual

### Colores del tema

Editar `tailwind.config.ts` → `theme.extend.colors`:

| Nombre | Uso | Color actual |
|--------|-----|-------------|
| `terracota` | Primario (botones, accents) | `#C25A3A` |
| `azulejo` | Secundario (azul sevillano) | `#2A5A8C` |
| `ocre` | Terciario (badges, highlights) | `#D9A760` |
| `crema` | Fondo | `#F7F0E3` |
| `tinta` | Texto principal | `#2B1E15` |

Para cambiar el tema a otros colores, simplemente edita los valores HEX. Ejemplo: tema azul marítimo:

```typescript
terracota: { DEFAULT: '#1E88E5', 500: '#1E88E5', /* ... */ },  // Azul
azulejo: { DEFAULT: '#00ACC1', /* ... */ },                    // Cyan
ocre: { DEFAULT: '#FFB300', /* ... */ },                       // Ámbar
crema: { DEFAULT: '#F5F5F5' },                                  // Blanco
tinta: { DEFAULT: '#263238' },                                  // Gris oscuro
```

### Fuentes

Edita `src/app/layout.tsx`:

```typescript
import { Cormorant_Garamond, Inter } from 'next/font/google';
// Cambiar por:
import { Playfair_Display, DM_Sans } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
```

Y actualiza `tailwind.config.ts`:

```typescript
fontFamily: {
  serif: ['var(--font-serif)', 'serif'],
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
},
```

### Logo / Branding

El "logo" es un badge con las iniciales "ES" en un cuadrado con color de marca. Para cambiarlo:

1. Busca `ES` en los componentes (`Header.tsx`, `Hero.tsx`, `Footer.tsx`, `admin/page.tsx`, `guia/page.tsx`)
2. Reemplaza por las iniciales de tu apartamento
3. O sustituye por un `<Image>` con tu logo en `/public/logo.svg`

### Iconos PWA

Sustituye los iconos en `public/icons/` con los de tu marca. Genera iconos en [realfavicongenerator.net](https://realfavicongenerator.net) y reemplaza los archivos.

Edita `public/manifest.json`:

```json
{
  "name": "Mi Apartamento",
  "short_name": "Mi Apt",
  "theme_color": "#1E88E5",    // tu color
  "background_color": "#F5F5F5",
  ...
}
```

---

## 🌍 Sistema de i18n (6 idiomas)

El proyecto usa `next-intl` con 6 idiomas: 🇪🇸 ES | 🇬🇧 EN | 🇫🇷 FR | 🇩🇪 DE | 🇮🇹 IT | 🇵🇹 PT.

### Estructura

- Config: `src/i18n.ts` (define `locales`, `Locale`, `localeNames`, `localeFlags`)
- Traducciones: `messages/{es,en,fr,de,it,pt}.json` (427 líneas cada uno)
- URLs: `/{locale}/...` (ej: `/es`, `/en/blog`, `/fr/guia`)

### Añadir un nuevo idioma

1. En `src/i18n.ts`, añade el locale al array:
   ```typescript
   export const locales = ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja'] as const;
   export const localeNames: Record<Locale, string> = { /* ... */, ja: '日本語' };
   export const localeFlags: Record<Locale, string> = { /* ... */, ja: '🇯🇵' };
   ```

2. Copia `messages/es.json` → `messages/ja.json` y traduce

3. Añade el locale a `date-fns` en `src/lib/utils.ts`:
   ```typescript
   import { es, enUS, fr, de, it, pt, ja } from 'date-fns/locale';
   ```

4. Añade `hreflang` en los metadatos de cada `page.tsx`

### Estructura de las traducciones

Cada `messages/{lang}.json` tiene estas secciones:

```
nav          → navegación
hero         → hero section
comparison   → comparador con Booking
booking      → reservas (fechas, precios, upsells, cupones)
gallery      → galería
map          → mapa, rutas, transporte
events       → eventos
reviews      → reseñas
faq          → 20 preguntas + respuestas
location     → ubicación + instrucciones llegada
chat         → chat IA
guestPortal  → pre-checkin + countdown
welcomeBook  → libro de bienvenida
footer       → footer
blog         → blog + posts
admin        → panel propietario
guide        → guía QR
cookies      → cookie banner RGPD
common       → textos comunes (loading, error, etc.)
seo          → títulos y descripciones SEO
```

---

## 📡 API Routes

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/availability` | GET | Fechas bloqueadas (Supabase + iCal) | Pública |
| `/api/bookings/checkout` | POST | Crear sesión Stripe Checkout | Pública |
| `/api/bookings/validate-coupon` | POST | Validar cupón Stripe | Pública |
| `/api/chat` | POST | Chat IA OpenRouter | Pública |
| `/api/weather` | GET | Meteorología Open-Meteo | Pública |
| `/api/pre-checkin` | POST | Submit pre-checkin a Supabase | Pública |
| `/api/whatsapp/send` | POST | Enviar WhatsApp Twilio | Pública |
| `/api/webhooks/stripe` | POST | Webhook Stripe | Stripe signature |
| `/api/admin/auth` | POST | Login admin | Pública |
| `/api/admin/bookings` | GET | Listar reservas | Admin cookie |
| `/api/admin/reviews` | GET | Listar reseñas | Admin cookie |
| `/api/admin/reviews` | PATCH | Aprobar/rechazar reseña | Admin cookie |
| `/api/admin/prices` | GET | Leer precios | Admin cookie |
| `/api/admin/prices` | PUT | Actualizar precios | Admin cookie |
| `/api/admin/revenue` | GET | Estadísticas ingresos | Admin cookie |
| `/api/admin/block-date` | POST | Bloquear fecha | Admin cookie |

### Ejemplo: crear reserva

```bash
# 1. Verificar disponibilidad
curl "https://tudominio.com/api/availability"
# → { "blockedDates": ["2026-07-15", "2026-07-16"] }

# 2. Crear sesión de pago
curl -X POST "https://tudominio.com/api/bookings/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "checkIn": "2026-07-20",
    "checkOut": "2026-07-23",
    "guests": 2,
    "upsells": [{"id": "airport-transfer"}],
    "couponCode": "ESENCIA10"
  }'
# → { "url": "https://checkout.stripe.com/..." }
```

### Ejemplo: chat IA

```bash
curl -X POST "https://tudominio.com/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "¿A qué hora es el check-in?"}]}'
# → { "reply": "El check-in es a partir de las 16:00h..." }
```

---

## 🔍 SEO y datos estructurados

### Schema JSON-LD implementado

| Tipo | Ubicación | Contenido |
|------|-----------|-----------|
| `LodgingBusiness` | `page.tsx` (home) | Nombre, dirección, geo, precio, check-in/out, amenidades |
| `AggregateRating` | `page.tsx` (home) | Puntuación media, número de reseñas |
| `Review` | `page.tsx` (home) | 3 reseñas destacadas |
| `WebSite` | `page.tsx` (home) | SearchAction para sitelinks |
| `FAQPage` | `FAQ.tsx` | 20 preguntas frecuentes |
| `Article` | `blog/[slug]/page.tsx` | Cada artículo del blog |
| `BreadcrumbList` | Pendiente | (añadir en futuras versiones) |

### Sitemap

`src/app/sitemap.ts` genera automáticamente:
- Todas las páginas en 6 idiomas
- Todos los artículos del blog
- `hreflang` alternates para cada URL
- `priority` y `changeFrequency` optimizados

### robots.txt

`src/app/robots.ts` permite indexación completa y referencia al sitemap.

### Open Graph + Twitter Cards

Configurados en cada `page.tsx` con:
- `og:title`, `og:description`, `og:image` (1200×630)
- `twitter:card: summary_large_image`
- `canonical` + `alternates.languages` (hreflang)

---

## 🔧 Mantenimiento y actualización

### Actualizar fotos del apartamento

1. Reemplaza archivos en `public/fotos/` (manten nombres foto1.jpg, foto2.jpg, etc.)
2. Formato recomendado: WebP, 1920×1080, <500KB cada una
3. No necesitas tocar código

### Actualizar precios

**Opción A (panel admin):** `/es/admin` → tab "Precios"

**Opción B (código):** Edita `src/data/apartment.ts`:
```typescript
basePricePerNight: 150,  // nuevo precio
cleaningFee: 70,
```

**Temporadas:** Edita `getSeasonMultiplier()` en `src/lib/utils.ts`:
```typescript
// Semana Santa
if ((month === 3 && day >= 25) || (month === 4 && day <= 10)) return 1.5;
// Añade tu propio evento:
if (month === 7 && day >= 15 && day <= 20) return 1.4; // Festival local
```

### Actualizar system prompt del chatbot

Edita `src/app/api/chat/route.ts` → `SYSTEM_PROMPT`. Incluye:
- Datos del apartamento (nombre, dirección, servicios)
- Normas y horarios
- Preguntas frecuentes
- Recomendaciones locales
- Instrucciones del libro de bienvenida

### Actualizar eventos

Edita `src/data/events.ts`. Añade, modifica o elimina eventos. Los eventos con `isHighSeason: true` activan el badge "temporada alta — reserva con antelación".

### Añadir artículo de blog

1. Añade entrada en `src/data/blog-posts.ts`
2. Añade traducciones en `messages/{lang}.json` → `blog.posts`
3. Imagen de portada: URL externa o archivo en `public/blog/`

### Añadir idioma

Ver sección "Sistema de i18n → Añadir un nuevo idioma".

### Actualizar iconos PWA

1. Genera iconos en [realfavicongenerator.net](https://realfavicongenerator.net)
2. Reemplaza archivos en `public/icons/`
3. Actualiza `public/manifest.json` si cambias nombre o colores

---

## ✅ Checklist post-despliegue

### SEO
- [ ] Verificar dominio en Google Search Console
- [ ] Enviar sitemap: `https://tudominio.com/sitemap.xml`
- [ ] Verificar Core Web Vitals con [PageSpeed Insights](https://pagespeed.web.dev)
- [ ] Configurar Google Business Profile
- [ ] Verificar hreflang en Search Console
- [ ] Registrar en Bing Webmaster Tools
- [ ] Test schema markup: [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verificar Open Graph: [Facebook Debugger](https://developers.facebook.com/tools/debug/)

### Analytics
- [ ] Configurar GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- [ ] Configurar Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`)
- [ ] Verificar eventos de conversión en Stripe

### Legal
- [ ] Política de Privacidad visible en footer
- [ ] Cookie banner funcional (RGPD)
- [ ] Número de registro turístico visible
- [ ] Cumplir Ley Orgánica 4/2015 (registro de viajeros)
- [ ] Verificar normativa apartamentos turísticos de tu comunidad

### Integraciones
- [ ] iCal sync con Booking.com (`ICAL_BOOKING_URL`)
- [ ] iCal sync con Airbnb (`ICAL_AIRBNB_URL`)
- [ ] Chat IA OpenRouter funcional
- [ ] Twilio WhatsApp configurado
- [ ] Resend emails funcionando
- [ ] Stripe webhook verificado

### PWA
- [ ] `manifest.json` válido ([PWABuilder](https://www.pwabuilder.com))
- [ ] Service worker activo (Chrome DevTools → Application)
- [ ] Instalación en móvil verificada
- [ ] Modo offline de la guía verificado

### Tour 360°
- [ ] Fotos equirectangulares subidas a `public/tours-360/`
- [ ] Tour funcional en móvil y desktop

### Blog
- [ ] Imágenes propias en artículos (reemplazar Unsplash)
- [ ] Alt text descriptivo en todas las imágenes

---

## ❓ FAQ técnica

### El build falla con "MISSING_MESSAGE"

Falta una clave de traducción en uno de los archivos `messages/*.json`. Compara las claves entre `es.json` y el idioma que falla. El build muestra qué clave falta y en qué idioma.

### Las reservas no aparecen en el calendario

Verifica que Supabase está accesible y las credenciales son correctas. El calendario consulta la tabla `blocked_dates` y sincroniza con iCal. Si `ICAL_BOOKING_URL` e `ICAL_AIRBNB_URL` están vacías, solo muestra fechas bloqueadas manualmente.

### El chat IA no responde

Verifica `OPENROUTER_API_KEY` y `OPENROUTER_MODEL`. El endpoint `/api/chat` hace una llamada a OpenRouter. Si la key es inválida o no hay créditos, devuelve error 500.

### El weather widget no carga

El endpoint `/api/weather` usa Open-Meteo (gratuito, sin API key). Si no carga, puede ser un problema de red o que las coordenadas (`NEXT_PUBLIC_APARTMENT_LAT/LNG`) son inválidas.

### El tour 360° muestra "Tour 360° — próximamente"

El botón se desactiva automáticamente cuando no hay fotos en `public/tours-360/`. Para activarlo:

```bash
python3 scripts/add-360-photos.py --dir ~/mis-fotos-360/
```

El script valida que cada foto sea equirectangular (ratio 2:1), la redimensiona a 4096 px
y la comprime a <500 KB, y la guarda con el nombre correcto (`salon.jpg`, `dormitorio.jpg`,
`cocina.jpg`, `bano.jpg`). Después: `systemctl --user restart esencia-sevilla`.

Para conseguir las fotos: cámara 360 (Insta360, Ricoh Theta), app móvil con modo fotosfera,
o un fotógrafo profesional de tours virtuales. Se toman a la altura de los ojos (1,5 m).

### El cookie banner no aparece

El banner se guarda en `localStorage` con la key `esencia-sevilla-cookie-consent`. Si ya aceptaste, no vuelve a aparecer. Para testing: borra el localStorage del navegador y recarga.

### ¿Puedo usar otra base de datos en vez de Supabase?

Sí, pero necesitarás adaptar `src/lib/supabase.ts` y las API routes que la usan. La arquitectura está diseñada para Supabase (PostgreSQL), pero la lógica de negocio es agnóstica.

### ¿Puedo añadir más apartamentos?

El proyecto está diseñado para **un solo apartamento**. Para múltiples apartamentos necesitarías:
- Añadir un campo `apartment_id` a todas las tablas
- Cambiar `APARTMENT` de constante a consulta dinámica
- añadir una landing de selección de apartamento

### ¿Cómo cambio el modelo de IA del chat?

Edita `OPENROUTER_MODEL` en `.env.local`. Modelos recomendados:
- `anthropic/claude-3-haiku` (mejor calidad, ~0.001€/msg)
- `mistralai/mistral-7b-instruct` (más barato)
- `meta-llama/llama-3-8b-instruct` (alternativa开放)

---

## 📄 Licencia

MIT — Libre uso, modificación y distribución. attribution apreciado pero no requerido.

---

## 🙋 Autor

**Daniel Martín Pérez** — doctorando QML en UPO Sevilla
- GitHub: [@danimap27](https://github.com/danimap27)
- Web: [esenciasevilla.com](https://esenciasevilla.com)

---

## 🚀 Comienza

```bash
git clone https://github.com/danimap27/esencia-sevilla.git
cd esencia-sevilla
npm install
cp .env.example .env.local
# Edita .env.local con tus claves
npm run dev
```

¡Tu apartamento turístico online en 5 minutos!