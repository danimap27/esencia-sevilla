# Esencia Sevilla — Plan de Implementación

> **Estado**: Base funcional (compila, 37 páginas estáticas, 6 idiomas)
> **Líneas existentes**: ~4,040 en src/
> **Stack**: Next.js 14 (App Router) + TypeScript + Tailwind + Supabase + Stripe + OpenRouter + Leaflet + next-intl

---

## 1. Auditoría: Módulos existentes vs spec

| # | Módulo spec | Estado | Archivos | Líneas | Notas |
|---|-------------|--------|----------|--------|-------|
| 1 | Hero / Landing | ⚠️ 70% | `Hero.tsx`, `Gallery.tsx` | 390 | Faltan: tour 360° Pannellum, comparador Booking, tour virtual |
| 2 | Sistema reservas dual | ⚠️ 75% | `BookingSection.tsx`, `availability/route.ts`, `checkout/route.ts`, `validate-coupon/route.ts`, `webhooks/stripe/route.ts` | 700 | iCal sync estructurado pero URLs vacías. Precio dinámico básico. Upsells definidos pero UI parcial |
| 3 | Portal huésped / Pre-check-in | ❌ 0% | — | 0 | No existe formulario pre-check-in, parte SES.HOSPEDERÍA, countdown, ni WhatsApp |
| 4 | Libro de bienvenida digital | ❌ 0% | — | 0 | No existe componente/página. Referencias en reseñas pero sin implementación |
| 5 | Sistema de reseñas | ⚠️ 60% | `Reviews.tsx`, `reviews.ts` | 249 | Faltan: import Google/Booking, subida fotos, moderación admin |
| 6 | Eventos en Sevilla | ⚠️ 70% | `EventsSection.tsx`, `events.ts` | 304 | Falta: widget tiempo real, urgencia dinámica |
| 7 | Chat IA asistente | ✅ 85% | `ChatWidget.tsx`, `chat/route.ts` | 377 | OpenRouter functional. Multilingüe. Falta: historial sesión |
| 8 | Mapa interactivo turístico | ✅ 80% | `MapSection.tsx`, `routes.ts`, `sights.ts` | 912 | Rutas, POIs, transporte. Muy completo |
| 9 | Sección ubicación | ✅ 85% | `LocationSection.tsx` | 154 | Referencias, instrucciones llegada |
| 10 | FAQ interactivo | ⚠️ 65% | `FAQ.tsx` | 108 | Radix accordion + schema FAQPage. Verificar 20+ preguntas |
| 11 | Legal y privacidad | ⚠️ 60% | `privacidad/page.tsx` | ~100 | Política RGPD completa. **Falta: cookie banner interactivo** |
| 12 | Modo QR — Guía offline | ⚠️ 50% | `guia/page.tsx` | ~200 | Página existe con mapa + chat. **Falta: PWA offline-first, contenido completo, selector idioma prominente** |
| 13 | Panel propietario | ⚠️ 60% | `admin/page.tsx`, `admin/auth`, `admin/bookings`, `admin/block-date` | 500 | Login, dashboard stats, bookings, QR download, block dates. **Faltan: gestión reseñas, edición precios/upsells, ingresos comparativa, acceso pre-checkin** |
| — | Blog | ❌ 0% | — | 0 | No existe. 5 artículos evergreen del spec |
| — | SEO técnico | ✅ 85% | `sitemap.ts`, `robots.ts`, schema JSON-LD en page.tsx | ~200 | Sitemap, robots, hreflang, OpenGraph, structured data (LodgingBusiness, AggregateRating, FAQPage) |

### i18n — Problema crítico

| Idioma | Líneas | Estado |
|--------|--------|--------|
| es.json | 390 | ✅ Completo |
| en.json | 390 | ✅ Completo |
| fr.json | 66 | ❌ Incompleto (~17% del es) |
| de.json | 21 | ❌ Casi vacío (~5% del es) |
| it.json | 21 | ❌ Casi vacío (~5% del es) |
| pt.json | 21 | ❌ Casi vacío (~5% del es) |

**4 idiomas están prácticamente sin traducir.** Esto romperá la UI en build time (errores MISSING_MESSAGE ya visibles en pt).

---

## 2. Arquitectura objetivo

```
esencia-sevilla/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Landing (existe)
│   │   │   ├── layout.tsx             # Root layout con i18n (existe)
│   │   │   ├── guia/page.tsx          # Guía QR offline (existe, ampliar)
│   │   │   ├── admin/page.tsx         # Panel propietario (existe, ampliar)
│   │   │   ├── privacidad/page.tsx   # Legal (existe)
│   │   │   ├── blog/                  # 🆕 Blog
│   │   │   │   ├── page.tsx           # Listado artículos
│   │   │   │   └── [slug]/page.tsx    # Artículo individual
│   │   │   ├── welcome-book/page.tsx  # 🆕 Libro de bienvenida digital
│   │   │   └── pre-checkin/page.tsx   # 🆕 Portal huésped pre-check-in
│   │   └── api/
│   │       ├── availability/route.ts          # (existe)
│   │       ├── bookings/checkout/route.ts      # (existe)
│   │       ├── bookings/validate-coupon/route.ts # (existe)
│   │       ├── webhooks/stripe/route.ts        # (existe)
│   │       ├── chat/route.ts                   # (existe)
│   │       ├── admin/auth/route.ts             # (existe)
│   │       ├── admin/bookings/route.ts         # (existe)
│   │       ├── admin/block-date/route.ts       # (existe)
│   │       ├── admin/reviews/route.ts          # 🆕 Moderación reseñas
│   │       ├── admin/prices/route.ts           # 🆕 Editar precios/upsells
│   │       ├── pre-checkin/route.ts            # 🆕 Submit pre-checkin form
│   │       ├── reviews/submit/route.ts         # 🆕 Subir reseña con fotos
│   │       ├── whatsapp/send/route.ts          # 🆕 Enviar WhatsApp Twilio
│   │       ├── weather/route.ts                # 🆕 Proxy Open-Meteo API
│   │       └── ical-export/route.ts            # 🆕 Exportar iCal propio
│   ├── components/
│   │   ├── Hero.tsx                   # (existe, ampliar: comparador)
│   │   ├── Gallery.tsx                # (existe)
│   │   ├── VirtualTour.tsx            # 🆕 Pannellum 360°
│   │   ├── BookingComparison.tsx       # 🆕 Tabla comparativa Booking
│   │   ├── BookingSection.tsx          # (existe, pulir)
│   │   ├── PreCheckinForm.tsx         # 🆕 Formulario pre-checkin
│   │   ├── GuestCountdown.tsx         # 🆕 Cuenta regresiva huésped
│   │   ├── WelcomeBook.tsx            # 🆕 Libro bienvenida digital
│   │   ├── CookieBanner.tsx           # 🆕 Banner cookies RGPD
│   │   ├── WeatherWidget.tsx          # 🆕 Widget tiempo Sevilla
│   │   ├── Reviews.tsx                # (existe, ampliar)
│   │   ├── EventsSection.tsx          # (existe, integrar weather)
│   │   ├── ChatWidget.tsx             # (existe)
│   │   ├── MapSection.tsx             # (existe)
│   │   ├── LocationSection.tsx        # (existe)
│   │   ├── FAQ.tsx                    # (existe, verificar 20+)
│   │   ├── Footer.tsx                 # (existe)
│   │   └── Header.tsx                 # (existe)
│   ├── data/
│   │   ├── apartment.ts               # (existe)
│   │   ├── routes.ts                  # (existe)
│   │   ├── sights.ts                  # (existe)
│   │   ├── events.ts                  # (existe)
│   │   └── blog-posts.ts              # 🆕 Datos de 5 artículos
│   ├── lib/
│   │   ├── supabase.ts                # (existe)
│   │   ├── stripe.ts                  # (existe)
│   │   ├── utils.ts                   # (existe)
│   │   ├── twilio.ts                  # 🆕 WhatsApp Cloud API client
│   │   ├── ses-parte.ts               # 🆕 Generar Parte Viajeros SES.HOSPEDERIA
│   │   └── ical.ts                    # 🆕 Parseo/generación iCal (extract de availability)
│   ├── messages/ → /messages/         # 6 idiomas (completar fr, de, it, pt)
│   └── types/index.ts                 # (existe, ampliar)
├── public/
│   ├── fotos/                         # 12 fotos (existe)
│   ├── tours-360/                     # 🆕 Esferas 360° por habitación
│   ├── blog/                          # 🆕 Imágenes blog
│   └── icons/                         # (existe, PWA)
├── next.config.mjs                    # (existe, añadir next-pwa)
├── tailwind.config.ts                 # (existe)
└── supabase/
    └── migrations/                    # 🆕 Schema SQL completo
```

---

## 3. Schema de Base de Datos (Supabase)

```sql
-- Apartamento / configuración
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS
  guest_phone TEXT,
  guest_passport_type TEXT,       -- 'dni' | 'passport' | 'nie'
  guest_passport_number TEXT,
  guest_nationality TEXT,
  guest_birthdate DATE,
  estimated_arrival_time TEXT,
  special_needs TEXT,
  precheckin_completed BOOLEAN DEFAULT false,
  precheckin_completed_at TIMESTAMPTZ;

-- Reseñas (nativa, además de importadas)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'direct',   -- 'direct' | 'google' | 'booking'
  external_id TEXT,
  stay_date DATE,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  locale TEXT DEFAULT 'es'
);

-- Bloqueos de calendario (mantenimiento, vacaciones)
CREATE TABLE IF NOT EXISTS blocked_dates (
  date DATE PRIMARY KEY,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog artículos
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,          -- markdown
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuración dinámica (precios, upsells)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (lectura de reseñas aprobadas)
CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (approved = true OR source IN ('google', 'booking'));
CREATE POLICY "blog_read" ON blog_posts FOR SELECT USING (published = true);
```

---

## 4. Fases de Implementación

### FASE 0 — Estabilización (urgente)
> Corregir lo que rompe el build y cierra gaps críticos

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| 0.1 Completar i18n: fr, de, it, pt | `messages/{fr,de,it,pt}.json` | Alto |
| 0.2 Cookie banner RGPD interactivo | `CookieBanner.tsx` + layout | Medio |
| 0.3 PWA config: next-pwa en next.config | `next.config.mjs` | Bajo |
| 0.4 Verificar 20+ preguntas en FAQ | `FAQ.tsx` + messages | Bajo |
| 0.5 PWA: service worker offline-first para /guia | `next.config.mjs` + manifest | Medio |

**Entrega funcional**: Build limpio sin warnings, cookie banner, PWA instalable.

---

### FASE 1 — Módulos de conversión
> Maximizar reservas directas y experiencia del huésped

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| 1.1 Comparador visual con Booking | `BookingComparison.tsx` | Medio |
| 1.2 Tour virtual 360° Pannellum | `VirtualTour.tsx` + tours-360/ | Medio |
| 1.3 Precio dinámico con eventos SVQ | `BookingSection.tsx` + data | Medio |
| 1.4 Verificar upsells UI completa | `BookingSection.tsx` | Bajo |
| 1.5 iCal export propio | `ical-export/route.ts` | Bajo |

**Entrega funcional**: Hero con comparador + tour 360, reservas con precio dinámico.

---

### FASE 2 — Experiencia del huésped
> Pre-check-in, libro de bienvenida, WhatsApp, weather

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| 2.1 Portal pre-check-in online | `PreCheckinForm.tsx`, `pre-checkin/page.tsx`, `api/pre-checkin/route.ts` | Alto |
| 2.2 Generación Parte Viajeros SES | `lib/ses-parte.ts` | Medio |
| 2.3 Libro de bienvenida digital | `WelcomeBook.tsx`, `welcome-book/page.tsx` | Alto |
| 2.4 Cuenta regresiva para huésped | `GuestCountdown.tsx` | Bajo |
| 2.5 WhatsApp notifications (Twilio) | `lib/twilio.ts`, `api/whatsapp/send/route.ts` | Medio |
| 2.6 Weather widget (Open-Meteo) | `WeatherWidget.tsx`, `api/weather/route.ts` | Bajo |

**Entrega funcional**: Huésped completa pre-checkin, recibe WhatsApp, ve countdown, usa libro bienvenida.

---

### FASE 3 — Contenido y SEO

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| 3.1 Blog con 5 artículos evergreen | `blog/page.tsx`, `blog/[slug]/page.tsx`, `data/blog-posts.ts` | Alto |
| 3.2 Schema Article en blog | page.tsx | Bajo |
| 3.3 SEO on-page: alt texts, canonicals | librería completa | Medio |
| 3.4 Open Graph + Twitter Cards por página | todos los page.tsx | Medio |

**Entrega funcional**: Blog funcional con 5 artículos optimizados.

---

### FASE 4 — Panel de propietario completo

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| 4.1 Tab gestión de reseñas (aprobar/rechazar) | `admin/page.tsx`, `api/admin/reviews/route.ts` | Medio |
| 4.2 Tab ingresos con comparativa mensual | `admin/page.tsx` | Medio |
| 4.3 Tab edición de precios y upsells | `admin/page.tsx`, `api/admin/prices/route.ts` | Medio |
| 4.4 Visualización datos pre-check-in | `admin/page.tsx` | Bajo |
| 4.5 Exportar Parte Viajeros desde panel | `admin/page.tsx`, `lib/ses-parte.ts` | Medio |

**Entrega funcional**: Propietario gestiona todo sin tocar Supabase ni Stripe.

---

### FASE 5 — Guía QR offline + pulido final

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| 5.1 Guía offline-first completa | `guia/page.tsx` + service worker | Alto |
| 5.2 Selector idioma prominente en guía | layout guia | Bajo |
| 5.3 Integrar weather widget en guía | `guia/page.tsx` | Bajo |
| 5.4 SEO checklist post-deploy | `DEPLOY.md` | Bajo |
| 5.5 .env.example actualizado | `.env.example` | Bajo |
| 5.6 Guía de mantenimiento | `MAINTENANCE.md` | Medio |

**Entrega funcional**: Guía offline completa, documentación de deploy y mantenimiento.

---

## 5. Dependencias a añadir

```bash
npm install pannellum react-pannellum    # Tour 360°
npm install openmeteo-client             # Weather (o fetch directo)
# Ya instalados: qrcode, ical.js, resend, stripe, @supabase/supabase-js, next-pwa
```

---

## 6. Nuevas variables de entorno

```bash
# Weather (gratuita, sin API key)
# Open-Meteo: https://api.open-meteo.com (no key needed)

# Blog (opcional: MDX remoto)
# No requiere claves adicionales si usamos markdown estático

# SES.HOSPEDERIA
# Endpoint: https://policia.ses.gob.es/proxyWebSesion/conexWSDL_SesHos
# Requiere certificado digital del propietario — documentar en DEPLOY.md
```

---

## 7. APIs externas

| Servicio | Uso | Auth | Coste |
|----------|-----|------|-------|
| Open-Meteo | Weather 7 días | Sin API key | Gratuito |
| Pannellum | Tour 360° | Sin API key (local) | Gratuito |
| Twilio WhatsApp | Notificaciones huésped | Twilio tokens | ~0.0058€/msg |
| SES.HOSPEDERIA | Parte viajeros | Certificado digital | Gratuito |
| OpenRouter | Chat IA | API key | ~0.001€/msg |
| Stripe | Pagos | API keys | 1.4% + 0.25€ |
| Supabase | DB + Auth | API keys | Free tier 500MB |
| Resend | Emails | API key | 3,000/mes gratis |

---

## 8. Estimación de esfuerzo por fase

| Fase | Módulos | Líneas nuevas est. | Prioridad |
|------|---------|-------------------|-----------|
| F0 — Estabilización | i18n, cookie, PWA | ~2,000 (i18n) | 🔴 Crítica |
| F1 — Conversión | Comparador, 360, precio dinámico | ~1,200 | 🟠 Alta |
| F2 — Experiencia huésped | Pre-checkin, libro, WhatsApp, weather | ~2,500 | 🟠 Alta |
| F3 — Contenido/SEO | Blog 5 artículos, schema | ~3,000 | 🟡 Media |
| F4 — Panel propietario | Reseñas, ingresos, precios, SES | ~1,500 | 🟡 Media |
| F5 — Guía offline + docs | Guía PWA, checklist, mantenimiento | ~1,000 | 🟡 Media |
| **Total** | | **~11,200 líneas nuevas** | |

---

## 9. Orden de ejecución propuesto

```
F0 (estabilización)
  └→ F1 (conversión) — paralelizable con F2 parcialmente
      └→ F2 (experiencia huésped)
          └→ F3 (contenido/SEO)
              └→ F4 (panel propietario)
                  └→ F5 (guía offline + docs)
```

Cada fase produce un deploy funcional y verificable de forma independiente.

---

## 10. Checklist de entregables finales

- [ ] Código fuente completo, comentado y tipado (TypeScript)
- [ ] `.env.example` con todas las claves documentadas
- [ ] Instrucciones de deploy en Vercel
- [ ] Guía de mantenimiento (fotos, precios, disponibilidad, chatbot, blog)
- [ ] Panel de propietario funcional
- [ ] QR de guía turística imprimible en alta resolución
- [ ] Checklist SEO post-deploy
- [ ] Checklist cumplimiento legal (RGPD, registro viajeros, normativa Andalucía)
- [ ] i18n completo en 6 idiomas
- [ ] PWA instalable (móvil + offline guía)
- [ ] Schema markup validado (Google Rich Results Test)
- [ ] Core Web Vitals en verde