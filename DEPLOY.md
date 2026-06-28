# Esencia Sevilla — Guía de Deploy y Mantenimiento

## Requisitos

- Node.js 20+
- Cuenta Supabase (gratuita)
- Cuenta Stripe
- Cuenta OpenRouter (para chat IA)
- Cuenta Resend (emails, 3,000/mes gratis)
- Cuenta Twilio (WhatsApp, opcional)

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
cp .env.example .env.local
```

### Obligatorias

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (server only) |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook de Stripe |
| `OPENROUTER_API_KEY` | API key de OpenRouter |
| `ADMIN_PASSWORD` | Contraseña del panel admin |

### Opcionales (recomendadas)

| Variable | Descripción |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Account SID de Twilio |
| `TWILIO_AUTH_TOKEN` | Auth token de Twilio |
| `TWILIO_WHATSAPP_FROM` | Número de Twilio (formato WhatsApp) |
| `RESEND_API_KEY` | API key de Resend para emails |
| `RESEND_FROM_EMAIL` | Email remitente |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID de Google Analytics 4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID de Meta Pixel |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Código de verificación Search Console |
| `ICAL_BOOKING_URL` | URL del calendario iCal de Booking.com |
| `ICAL_AIRBNB_URL` | URL del calendario iCal de Airbnb |

### Datos del apartamento

| Variable | Valor por defecto |
|----------|-------------------|
| `NEXT_PUBLIC_APARTMENT_NAME` | "Esencia Sevilla" |
| `NEXT_PUBLIC_APARTMENT_ADDRESS` | "Imaginero Luis Alvarez Duarte N7, 41008 Sevilla" |
| `NEXT_PUBLIC_APARTMENT_LAT` | 37.3886 |
| `NEXT_PUBLIC_APARTMENT_LNG` | -5.9823 |
| `NEXT_PUBLIC_APARTMENT_PHONE` | +34 600 000 000 |
| `NEXT_PUBLIC_APARTMENT_WHATSAPP` | 34600000000 |
| `NEXT_PUBLIC_APARTMENT_EMAIL` | hola@esenciasevilla.com |
| `NEXT_PUBLIC_REGISTRATION_NUMBER` | AT/SE/03584 |
| `NEXT_PUBLIC_BASE_PRICE_PER_NIGHT` | 142 |
| `NEXT_PUBLIC_CLEANING_FEE` | 60 |
| `NEXT_PUBLIC_TOURIST_TAX` | 1.50 |
| `NEXT_PUBLIC_MAX_GUESTS` | 4 |

## Schema de Supabase

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Tabla de reservas (ya existe, ampliar con pre-checkin)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS
  guest_phone TEXT,
  guest_passport_type TEXT,
  guest_passport_number TEXT,
  guest_nationality TEXT,
  guest_birthdate DATE,
  estimated_arrival_time TEXT,
  special_needs TEXT,
  precheckin_completed BOOLEAN DEFAULT false,
  precheckin_completed_at TIMESTAMPTZ;

-- Reseñas nativas
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'direct',
  external_id TEXT,
  stay_date DATE,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  locale TEXT DEFAULT 'es'
);

-- Fechas bloqueadas
CREATE TABLE IF NOT EXISTS blocked_dates (
  date DATE PRIMARY KEY,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuración dinámica
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "blocked_dates_read" ON blocked_dates FOR SELECT USING (true);
```

## Deploy en Vercel

1. **Fork/Clone** el repositorio a GitHub
2. En Vercel, **New Project** → selecciona el repo
3. **Settings → Environment Variables**: añade todas las variables de `.env.example`
4. **Deploy**
5. Configura el dominio `esenciasevilla.com` en Settings → Domains

### Webhook de Stripe

1. En Stripe Dashboard → Developers → Webhooks
2. **Add endpoint**: `https://esenciasevilla.com/api/webhooks/stripe`
3. Eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
4. Copia el `signing secret` a `STRIPE_WEBHOOK_SECRET`

## Checklist post-deploy

### SEO
- [ ] Verificar en Google Search Console
- [ ] Enviar sitemap: `https://esenciasevilla.com/sitemap.xml`
- [ ] Verificar Core Web Vitals (PageSpeed Insights)
- [ ] Configurar Google Business Profile
- [ ] Verificar hreflang en Google Search Console
- [ ] Registrar en Bing Webmaster Tools
- [ ] Testing schema markup: Google Rich Results Test
- [ ] Verificar Open Graph con Facebook Debugger

### Analytics
- [ ] Configurar GA4 con `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] Configurar Meta Pixel con `NEXT_PUBLIC_META_PIXEL_ID`
- [ ] Verificar eventos de conversión en Stripe

### Legal
- [ ] Política de Privacidad visible en footer
- [ ] Banner de cookies funcional (RGPD)
- [ ] Número de registro turístico visible (AT/SE/03584)
- [ ] Cumplir Ley Orgánica 4/2015 (registro de viajeros)
- [ ] Verificar normativa apartamentos turísticos Andalucía

### Integraciones
- [ ] Configurar iCal sync con Booking.com
- [ ] Configurar iCal sync con Airbnb
- [ ] Verificar OpenRouter chat IA
- [ ] Configurar Twilio WhatsApp
- [ ] Configurar Resend emails

### PWA
- [ ] Verificar manifest.json válido
- [ ] Verificar service worker activo
- [ ] Verificar instalación en móvil
- [ ] Verificar modo offline de la guía

### Tour 360°
- [ ] Subir fotos equirectangulares a `public/tours-360/`
- [ ] Nombres: `salon.jpg`, `dormitorio.jpg`, `cocina.jpg`, `bano.jpg`
- [ ] Probar tour en móvil

### Blog
- [ ] Añadir imágenes propias a los artículos (reemplazar Unsplash)
- [ ] Verificar alt text en todas las imágenes

## Mantenimiento

### Actualizar fotos del apartamento
1. Coloca fotos en `public/fotos/` (foto1.jpg, foto2.jpg, etc.)
2. Formato WebP recomendado para mejor performance
3. Las fotos del Hero usan: foto1-foto5.jpg

### Actualizar precios
1. Panel admin → Precios
2. O editar `src/data/apartment.ts` → `APARTMENT.basePricePerNight`
3. Si se cambia la temporada, editar `getSeasonMultiplier()` en `src/lib/utils.ts`

### Actualizar System Prompt del Chatbot
Editar `src/app/api/chat/route.ts` → constante `SYSTEM_PROMPT`

### Actualizar eventos
Editar `src/data/events.ts`

### Actualizar POIs del mapa
Editar `src/data/sights.ts` y `src/data/routes.ts`

### Añadir artículo de blog
1. Añadir entrada en `src/data/blog-posts.ts`
2. Añadir traducciones en `messages/{es,en,fr,de,it,pt}.json` → `blog.posts`
3. Cubierta: usar imagen en `public/blog/` o URL de Unsplash

### Actualizar reseñas importadas
Editar `src/data/reviews.ts`

## Estructura de archivos

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx          # Landing
│   │   ├── blog/
│   │   │   ├── page.tsx       # Listado blog
│   │   │   └── [slug]/page.tsx # Artículo
│   │   ├── guia/page.tsx     # Guía QR offline
│   │   ├── admin/page.tsx    # Panel propietario
│   │   ├── pre-checkin/page.tsx  # Portal huésped
│   │   ├── welcome-book/page.tsx # Libro bienvenida
│   │   └── privacidad/page.tsx    # Política RGPD
│   └── api/
│       ├── weather/          # Proxy Open-Meteo (gratuito)
│       ├── chat/             # OpenRouter chat IA
│       ├── bookings/         # Stripe checkout + cupones
│       ├── pre-checkin/      # Submit pre-checkin
│       ├── whatsapp/send/    # Twilio WhatsApp
│       └── admin/            # Auth, bookings, reviews, prices, revenue
├── components/
│   ├── Hero.tsx, Gallery.tsx, BookingComparison.tsx
│   ├── VirtualTour.tsx       # Tour 360° Pannellum
│   ├── BookingSection.tsx    # Reserva con precio dinámico
│   ├── MapSection.tsx        # Mapa Leaflet + rutas + POIs
│   ├── WeatherWidget.tsx     # Open-Meteo
│   ├── ChatWidget.tsx        # OpenRouter chat IA
│   ├── PreCheckinForm.tsx    # Formulario pre-checkin
│   ├── GuestCountdown.tsx    # Cuenta regresiva
│   ├── WelcomeBook.tsx       # Libro bienvenida digital
│   ├── CookieBanner.tsx      # Banner RGPD granular
│   └── FAQ.tsx, Reviews.tsx, EventsSection.tsx, etc.
├── data/                     # Datos estáticos (apartamento, rutas, POIs, eventos, blog)
├── lib/                      # Utils, Supabase, Stripe, Twilio
└── messages/                 # 6 idiomas (es, en, fr, de, it, pt)
```