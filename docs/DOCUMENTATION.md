# Esencia Sevilla — Documentación Técnica Completa

**Versión:** 1.0.0  
**Fecha:** Abril 2026  
**Repositorio:** https://github.com/danimap27/esencia-sevilla  
**Stack principal:** Next.js 14 · TypeScript · Tailwind CSS · Supabase · Stripe · OpenRouter  
**Registro Turístico:** AT/SE/03584

---

## Tabla de contenidos

1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Estructura del proyecto](#4-estructura-del-proyecto)
5. [Sistema de diseño](#5-sistema-de-diseño)
6. [Componentes de interfaz](#6-componentes-de-interfaz)
7. [Páginas y rutas](#7-páginas-y-rutas)
8. [API REST — Referencia completa](#8-api-rest--referencia-completa)
9. [Base de datos](#9-base-de-datos)
10. [Motor de precios](#10-motor-de-precios)
11. [Internacionalización](#11-internacionalización)
12. [Pasarela de pago (Stripe)](#12-pasarela-de-pago-stripe)
13. [Sistema de disponibilidad e iCal](#13-sistema-de-disponibilidad-e-ical)
14. [IA conversacional (Chatbot)](#14-ia-conversacional-chatbot)
15. [SEO y datos estructurados](#15-seo-y-datos-estructurados)
16. [PWA y Service Worker](#16-pwa-y-service-worker)
17. [Panel de administración](#17-panel-de-administración)
18. [Notificaciones y comunicación](#18-notificaciones-y-comunicación)
19. [Analytics y seguimiento](#19-analytics-y-seguimiento)
20. [Seguridad](#20-seguridad)
21. [Cumplimiento legal (RGPD)](#21-cumplimiento-legal-rgpd)
22. [Variables de entorno](#22-variables-de-entorno)
23. [Despliegue](#23-despliegue)
24. [Testing](#24-testing)
25. [Rendimiento y Core Web Vitals](#25-rendimiento-y-core-web-vitals)
26. [Trabajo futuro](#26-trabajo-futuro)

---

## 1. Descripción general

### 1.1 Visión del producto

**Esencia Sevilla** es una aplicación web de producción desarrollada con Next.js 14 para la gestión integral y comercialización directa de un apartamento turístico de alta gama ubicado en el corazón histórico de Sevilla.

La plataforma persigue un objetivo principal de negocio: **captar reservas directas ofreciendo un descuento permanente del 10% sobre los precios publicados en OTAs** (Booking.com, Airbnb), reduciendo la comisión que se pierde con estos intermediarios y maximizando el margen del propietario. En paralelo, ofrece una experiencia de huésped superior a la de cualquier plataforma de alquiler vacacional: información en el idioma nativo, guía turística interactiva, chatbot de IA disponible 24/7, y pre-check-in digital.

### 1.2 Datos del inmueble

| Campo | Valor |
|---|---|
| Nombre comercial | Esencia Sevilla |
| Dirección | Imaginero Luis Alvarez Duarte N7, 41008 Sevilla, España |
| Coordenadas GPS | 37.38862°N, -5.98230°W |
| Nº Registro Turístico | AT/SE/03584 (Junta de Andalucía) |
| Capacidad | 4 huéspedes |
| Dormitorios | 2 (3 camas) |
| Baños | 1 |
| Superficie | 65 m² |
| Precio base | €142/noche |
| Tarifa de limpieza | €60 (única por estancia) |
| Tasa turística | €1,50 por persona y noche |
| Estancia mínima | 2 noches |
| Check-in | A partir de las 16:00 h |
| Check-out | Antes de las 11:00 h |

### 1.3 Amenities del apartamento

| Categoría | Servicios |
|---|---|
| Conectividad | WiFi 5G (EsenciaSevilla_5G) |
| Climatización | Aire acondicionado y calefacción |
| Cocina | Cocina completa, cafetera, microondas |
| Electrodomésticos | Lavadora |
| Entretenimiento | Smart TV |
| Acceso | Auto check-in (caja de llaves), ascensor |

### 1.4 Puntos de interés cercanos

| Monumento | Distancia a pie |
|---|---|
| Barrio de Santa Cruz | 6 min |
| Torre del Oro | 7 min |
| Catedral de Sevilla | 8 min |
| Archivo de Indias | 9 min |
| La Giralda | 9 min |
| Real Alcázar | 10 min |
| Plaza de España | 12 min |
| Museo de Bellas Artes | 15 min |

### 1.5 Alcance de la versión 1.0

La versión 1.0 incluye los siguientes módulos funcionales:

- **Presentación del apartamento:** galería fotográfica, descripción, mapa interactivo
- **Sistema de reservas:** calendario en tiempo real, selección de extras, cupones
- **Pago online:** Stripe Checkout con tarjeta, Apple Pay y Google Pay
- **Comparativa de precios:** visualización del ahorro vs Booking.com
- **Sincronización de calendarios:** iCal bidireccional con Booking.com y Airbnb
- **Chatbot IA:** asistente virtual con contexto completo del apartamento
- **Guía turística:** mapa Leaflet con atracciones, rutas y transporte público
- **Eventos de Sevilla:** calendario de eventos anuales (Semana Santa, Feria, etc.)
- **Pre-check-in digital:** portal para recogida de datos de viajeros
- **Panel de administración:** gestión de reservas, bloqueo de fechas, QR
- **Multiidioma:** 6 idiomas con detección automática del navegador
- **SEO completo:** JSON-LD, hreflang, sitemap dinámico, robots.txt
- **PWA:** instalable en móvil, acceso offline a la guía turística
- **RGPD:** política de privacidad, gestión de consentimiento

---

## 2. Stack tecnológico

### 2.1 Frontend

| Librería | Versión | Uso detallado |
|---|---|---|
| **Next.js** | 14.2.5 | Framework con App Router, React Server Components, Route Handlers, Middleware |
| **React** | 18.3.1 | UI library con Suspense, concurrent rendering |
| **TypeScript** | ^5 | Tipado estático en toda la aplicación |
| **Tailwind CSS** | ^3.4.6 | Estilos utilitarios con design tokens personalizados |
| **next-intl** | ^3.17.3 | i18n con soporte para App Router y Server Components |
| **framer-motion** | ^11.2.12 | Animaciones de entrada, transiciones, acordeones |
| **lucide-react** | ^0.411.0 | Iconografía SVG consistente |
| **react-day-picker** | ^8.10.1 | Selector de fechas con modo `DateRange`, localización completa |
| **react-leaflet** | ^4.2.1 | Wrapper React para Leaflet (carga dinámica, SSR desactivado) |
| **leaflet** | ^1.9.4 | Motor de mapas basado en tiles de OpenStreetMap |
| **react-hot-toast** | ^2.4.1 | Notificaciones toast con estilos personalizados |
| **@radix-ui/react-dialog** | ^1.1.1 | Modal accesible (lightbox, modales de ruta) |
| **@radix-ui/react-accordion** | ^1.2.0 | FAQ y secciones colapsables accesibles |
| **@radix-ui/react-tabs** | ^1.1.0 | Pestañas en BookingSection y MapSection |
| **@radix-ui/react-select** | ^2.1.1 | Selectores accesibles |
| **@radix-ui/react-scroll-area** | ^1.1.0 | Scroll suavizado en listados |
| **date-fns** | ^3.6.0 | Manipulación de fechas con soporte de 6 locales |
| **clsx** | ^2.1.1 | Composición condicional de clases |
| **tailwind-merge** | ^2.4.0 | Merge inteligente de clases Tailwind (evita conflictos) |

### 2.2 Backend y servicios externos

| Servicio | Versión | Descripción detallada |
|---|---|---|
| **Supabase** | ^2.44.4 | PostgreSQL gestionado con RLS, API REST automática, autenticación |
| **Stripe** | ^16.2.0 | Checkout Sessions, webhooks, gestión de pagos PCI-DSS compliant |
| **@stripe/stripe-js** | ^4.1.0 | Stripe.js para el frontend (Apple Pay, Google Pay, Payment Request) |
| **Resend** | ^3.4.0 | Emails transaccionales HTML con dominio propio |
| **OpenRouter** | HTTP REST | Proxy de IA que soporta Claude, GPT-4, Mistral, etc. |
| **Twilio** | HTTP REST | WhatsApp Business API para notificaciones al propietario |
| **ical.js** | ^2.0.1 | Parser de estándares iCal/iCalendar (RFC 5545) |

### 2.3 Herramientas y utilidades

| Herramienta | Versión | Uso |
|---|---|---|
| **Zod** | ^3.23.8 | Validación y parseo de esquemas en todas las API routes |
| **qrcode** | ^1.5.4 | Generación de códigos QR en el panel de administración |
| **next-pwa** | ^5.6.0 | PWA: genera Service Worker con estrategias Workbox |
| **workbox-webpack-plugin** | ^7.0.0 | Plugin Workbox para estrategias de caché offline |

### 2.4 Dependencias de desarrollo

| Herramienta | Versión | Uso |
|---|---|---|
| **TypeScript** | ^5 | Compilación y verificación de tipos |
| **ESLint** | ^8 + eslint-config-next | Linting con reglas de Next.js |
| **PostCSS** | ^8.4.39 | Procesamiento de CSS (autoprefixer + Tailwind) |
| **autoprefixer** | ^10.4.19 | Prefijos vendor automáticos en CSS |
| **@types/leaflet** | ^1.9.12 | Tipos TypeScript para Leaflet |
| **@types/qrcode** | ^1.5.5 | Tipos TypeScript para qrcode |

---

## 3. Arquitectura del sistema

### 3.1 Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser / PWA)                      │
│                                                                   │
│  ┌───────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────┐  │
│  │ React 18  │  │  next-intl   │  │ Leaflet  │  │DayPicker  │  │
│  │ (RSC+CC)  │  │  (6 locales) │  │  (SSR-)  │  │ (rangos)  │  │
│  └───────────┘  └──────────────┘  └──────────┘  └───────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/2 · TLS 1.3
┌────────────────────────────▼────────────────────────────────────┐
│                     NEXT.JS 14 APP ROUTER                        │
│                    (Edge/Node.js Runtime)                         │
│                                                                   │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐  │
│  │  SERVER COMPONENTS   │  │         API ROUTES              │  │
│  │  ─────────────────   │  │  ─────────────────────────────  │  │
│  │  [locale]/page       │  │  GET  /availability             │  │
│  │  [locale]/guia       │  │  POST /bookings/checkout        │  │
│  │  [locale]/admin      │  │  POST /bookings/validate-coupon │  │
│  │  [locale]/privacidad │  │  POST /chat                     │  │
│  │  sitemap.ts          │  │  POST /webhooks/stripe          │  │
│  │  robots.ts           │  │  POST /admin/auth               │  │
│  └──────────────────────┘  │  GET  /admin/bookings           │  │
│                             │  POST /admin/block-date         │  │
│  ┌──────────────────────┐  │  DEL  /admin/block-date         │  │
│  │     MIDDLEWARE       │  └────────────────┬────────────────┘  │
│  │  i18n locale routing │                   │                   │
│  └──────────────────────┘                   │                   │
└────────────────────────────────────────────┼────────────────────┘
                                             │ Servicios externos
              ┌─────────────────────────┬────┴────┬────────────────┐
              │                         │         │                │
    ┌─────────▼──────┐  ┌──────────────▼─┐  ┌───▼────────┐  ┌───▼────────┐
    │   Supabase      │  │     Stripe      │  │ OpenRouter │  │  Resend /  │
    │  PostgreSQL     │  │   Checkout      │  │  AI Proxy  │  │  Twilio    │
    │  + RLS          │  │   + Webhooks    │  │ (Chatbot)  │  │ (Comms)    │
    └────────┬────────┘  └─────────────────┘  └────────────┘  └────────────┘
             │
             │  iCal sync (por petición, caché 5 min)
    ┌────────▼─────────────────────────────────┐
    │  Booking.com iCal  ·  Airbnb iCal         │
    │  (prevención de double-booking)           │
    └───────────────────────────────────────────┘
```

### 3.2 Patrones de renderizado

| Tipo | Uso en la aplicación |
|---|---|
| **Server Components (RSC)** | Layout, Header/Footer, páginas estáticas (privacidad, términos), sitemap |
| **Client Components (CC)** | Hero, BookingSection, Gallery, FAQ, Reviews, ChatWidget, MapSection, Admin |
| **Dynamic Import (SSR off)** | MapSection (Leaflet), ChatWidget (window dependency) |
| **API Routes** | Todas las interacciones con BD, Stripe, IA, autenticación |
| **Middleware** | Detección y redirección de locale i18n |

### 3.3 Flujo completo de una reserva

```
Usuario                  Frontend              Backend              Externos
  │                         │                    │                     │
  │── Llega a la web ──────►│                    │                     │
  │                         │── GET /availability ──────────────────────►
  │                         │                    │── Supabase query    │
  │                         │                    │── iCal Booking.com ──►
  │                         │                    │── iCal Airbnb ───────►
  │                         │◄── { blockedDates } ◄──────────────────────
  │◄── Fechas bloqueadas en DayPicker ──────────│                     │
  │                         │                    │                     │
  │── Selecciona fechas ───►│                    │                     │
  │── Selecciona extras ───►│                    │                     │
  │── Aplica cupón ────────►│── POST /validate-coupon ─────────────────►
  │                         │◄── { valid, discountValue } ─────────────│
  │◄── Precio actualizado   │                    │                     │
  │                         │                    │                     │
  │── Click "Reservar" ────►│── POST /bookings/checkout                │
  │                         │                    │── Zod validation    │
  │                         │                    │── Verify availability
  │                         │                    │── calculatePrice()  │
  │                         │                    │── createCheckoutSession ──►
  │                         │                    │◄── { session.url } ─────│
  │                         │                    │── INSERT booking (pending)
  │                         │◄── { url, bookingRef } ──────────────────│
  │◄── Redirect to Stripe   │                    │                     │
  │                         │                    │                     │
  │── Paga con tarjeta ─────────────────────────────────────────────►Stripe
  │                         │                    │                     │
  │                         │                    │◄── POST /webhooks/stripe
  │                         │                    │  (checkout.session.completed)
  │                         │                    │── Verify signature  │
  │                         │                    │── UPDATE booking (confirmed)
  │                         │                    │── INSERT blocked_dates
  │                         │                    │── sendEmail (Resend) ──►
  │                         │                    │── WhatsApp (Twilio) ──►
  │◄── /reserva-confirmada  │                    │                     │
```

### 3.4 Modelo de caché

| Recurso | Estrategia | TTL |
|---|---|---|
| Disponibilidad (iCal) | In-memory Map en servidor | 5 minutos |
| Imágenes estáticas | Vercel CDN / browser cache | 1 año |
| Fuentes Google | Service Worker (StaleWhileRevalidate) | 30 días |
| Páginas i18n | Next.js ISR (revalidación 24h) | Variable |
| API de chat | Sin caché (streaming) | — |

---

## 4. Estructura del proyecto

```
esencia-sevilla/
├── .claude/
│   └── launch.json              # Configuración dev server para Claude Code
├── .env.example                 # Template de variables de entorno
├── .gitignore
├── .npmrc                       # Configuración npm/pnpm
├── DEPLOY.md                    # Guía de despliegue operacional
├── docs/
│   ├── DOCUMENTATION.md         # Este documento
│   └── DOCUMENTATION.tex        # Versión LaTeX
├── messages/                    # Archivos de traducción i18n
│   ├── es.json                  # Español (~150 claves) — locale por defecto
│   ├── en.json                  # Inglés
│   ├── fr.json                  # Francés
│   ├── de.json                  # Alemán
│   ├── it.json                  # Italiano
│   └── pt.json                  # Portugués
├── middleware.ts                # Middleware next-intl (intercepción de rutas)
├── next.config.mjs              # Config Next.js: next-intl + PWA + imágenes
├── tailwind.config.ts           # Design tokens: colores, sombras, animaciones
├── postcss.config.js            # PostCSS: Tailwind + autoprefixer
├── tsconfig.json                # Configuración TypeScript strict mode
├── package.json                 # Dependencias y scripts npm
│
├── public/                      # Assets estáticos servidos directamente
│   ├── manifest.json            # PWA Web App Manifest
│   ├── og-image.jpg             # Open Graph image (1200×630px)
│   ├── fotos/                   # Fotos del apartamento
│   │   ├── foto1.jpg … foto12.jpg  # Mínimo 10 fotos, formato WebP recomendado
│   │   └── hero-*.jpg           # Fotos del carousel del hero (5 imágenes)
│   ├── icons/                   # Iconos PWA
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   └── leaflet/                 # Marcadores del mapa Leaflet
│       ├── marker-icon.png
│       ├── marker-icon-2x.png
│       └── marker-shadow.png
│
└── src/
    ├── i18n.ts                  # Configuración de locales y nombres
    ├── types/
    │   └── index.ts             # Todas las interfaces TypeScript
    │
    ├── data/                    # Datos estáticos del apartamento
    │   ├── apartment.ts         # APARTMENT, UPSELLS, AMENITIES, HOUSE_RULES, etc.
    │   ├── sights.ts            # 10 atracciones + 6 servicios cercanos + 5 líneas bus
    │   ├── routes.ts            # 5 rutas turísticas con paradas georeferenciadas
    │   ├── events.ts            # 5 eventos anuales de Sevilla (2026)
    │   └── reviews.ts           # 6 reseñas multilingüe (seed inicial para la BD)
    │
    ├── lib/
    │   ├── supabase.ts          # Clientes Supabase (anon + admin) + esquema SQL
    │   ├── stripe.ts            # Cliente Stripe + createCheckoutSession()
    │   └── utils.ts             # calculatePrice, formatDate, getSeasonMultiplier, etc.
    │
    ├── components/              # Componentes React
    │   ├── Header.tsx           # Navegación + selector de idioma + menú móvil
    │   ├── Hero.tsx             # Carousel + contador ahorro + CTAs
    │   ├── Gallery.tsx          # Grid 12 fotos + lightbox fullscreen
    │   ├── BookingSection.tsx   # DayPicker + upsells + cupón + Stripe
    │   ├── MapSection.tsx       # Leaflet + rutas + transporte (SSR off)
    │   ├── ChatWidget.tsx       # Chatbot IA flotante (SSR off)
    │   ├── FAQ.tsx              # 20 preguntas + búsqueda + acordeón
    │   ├── Reviews.tsx          # Reseñas con valoración media
    │   ├── EventsSection.tsx    # Eventos de Sevilla 2026
    │   ├── LocationSection.tsx  # Mapa embed + instrucciones llegada
    │   └── Footer.tsx           # Datos contacto + links legales
    │
    └── app/
        ├── globals.css          # Variables CSS + clases utilitarias
        ├── layout.tsx           # Root layout: fuentes + manifest
        ├── sitemap.ts           # Sitemap XML dinámico (30 URLs)
        ├── robots.ts            # robots.txt
        │
        ├── [locale]/
        │   ├── layout.tsx       # NextIntlClientProvider + Toaster
        │   ├── page.tsx         # Home: JSON-LD + todos los componentes
        │   ├── guia/
        │   │   └── page.tsx     # Guía turística offline
        │   ├── admin/
        │   │   └── page.tsx     # Panel de administración
        │   └── privacidad/
        │       └── page.tsx     # Política de privacidad RGPD
        │
        └── api/
            ├── availability/
            │   └── route.ts     # GET — Fechas bloqueadas + sync iCal
            ├── chat/
            │   └── route.ts     # POST — Proxy a OpenRouter
            ├── bookings/
            │   ├── checkout/
            │   │   └── route.ts # POST — Crear sesión Stripe
            │   └── validate-coupon/
            │       └── route.ts # POST — Validar cupón
            ├── webhooks/
            │   └── stripe/
            │       └── route.ts # POST — Eventos de Stripe
            └── admin/
                ├── auth/
                │   └── route.ts # POST — Login admin
                ├── bookings/
                │   └── route.ts # GET — Lista reservas
                └── block-date/
                    └── route.ts # POST/DELETE — Gestión bloqueos
```

---

## 5. Sistema de diseño

### 5.1 Paleta de colores

Los colores del diseño evocan la arquitectura y cultura sevillana: terracota de las tejas, azulejo de las paredes, ocre de las fachadas.

| Token | Hex | Uso |
|---|---|---|
| `terracota-500` | `#C25A3A` | Color primario: CTAs, acentos, hover |
| `terracota-50` | `#FDF5F2` | Fondos suaves |
| `terracota-900` | `#4A1505` | Texto oscuro sobre fondo terracota |
| `azulejo-500` | `#2A5A8C` | Color secundario: enlaces, información |
| `azulejo-50` | `#EFF5FB` | Fondos informativos |
| `ocre-500` | `#D9A760` | Acentos cálidos, badges de temporada |
| `crema` | `#F7F0E3` | Fondo principal de la aplicación |
| `tinta` | `#2B1E15` | Color de texto principal |

```typescript
// tailwind.config.ts — Escala completa de terracota
colors: {
  terracota: {
    50: '#FDF5F2', 100: '#FAE5DC', 200: '#F5C4AE',
    300: '#EDA081', 400: '#E07A59', 500: '#C25A3A',
    600: '#A34529', 700: '#82321B', 800: '#622110',
    900: '#4A1505',
  },
  crema: '#F7F0E3',
  tinta: '#2B1E15',
}
```

### 5.2 Tipografía

```css
/* Serif para títulos — elegancia mediterránea */
--font-cormorant: 'Cormorant Garamond', Georgia, serif;

/* Sans-serif para cuerpo — legibilidad óptima */
--font-inter: 'Inter', system-ui, sans-serif;
```

| Elemento | Fuente | Tamaño | Peso |
|---|---|---|---|
| H1 (hero) | Cormorant Garamond | 4rem–6rem | 400 |
| H2 (sección) | Cormorant Garamond | 2.5rem–3rem | 400 |
| H3 (subsección) | Inter | 1.25rem | 600 |
| Cuerpo | Inter | 1rem | 400 |
| UI (botones, labels) | Inter | 0.875rem | 500 |
| Código | JetBrains Mono (CDN) | 0.875rem | 400 |

### 5.3 Sombras personalizadas

```typescript
boxShadow: {
  'soft':   '0 2px 8px 0 rgba(43,30,21,0.06)',
  'medium': '0 4px 16px 0 rgba(43,30,21,0.10)',
  'large':  '0 8px 32px 0 rgba(43,30,21,0.14)',
  'card':   '0 1px 4px 0 rgba(43,30,21,0.08), 0 4px 12px 0 rgba(43,30,21,0.08)',
}
```

### 5.4 Animaciones

```typescript
keyframes: {
  slideUpFade: { '0%': { opacity: '0', transform: 'translateY(20px)' },
                 '100%': { opacity: '1', transform: 'translateY(0)' } },
  scaleIn:     { '0%': { opacity: '0', transform: 'scale(0.95)' },
                 '100%': { opacity: '1', transform: 'scale(1)' } },
  float:       { '0%, 100%': { transform: 'translateY(0)' },
                 '50%': { transform: 'translateY(-6px)' } },
  shimmer:     { '0%': { backgroundPosition: '-200% 0' },
                 '100%': { backgroundPosition: '200% 0' } },
}
```

### 5.5 Clases de componente utilitarias

Definidas en `globals.css` para uso consistente:

| Clase | Descripción |
|---|---|
| `.btn-primary` | Botón terracota sólido con hover y focus ring |
| `.btn-secondary` | Botón azulejo sólido |
| `.btn-outline` | Botón con borde terracota transparente |
| `.card` | Contenedor con fondo blanco, sombra y bordes redondeados |
| `.section` | Sección con padding vertical estándar |
| `.input` | Input estilizado con focus ring terracota |
| `.badge` | Etiqueta pequeña con colores semánticos |
| `.glass` | Fondo glass morfismo claro (`backdrop-filter: blur`) |
| `.glass-dark` | Fondo glass morfismo oscuro |

---

## 6. Componentes de interfaz

### 6.1 `Header`

**Archivo:** `src/components/Header.tsx`  
**Tipo:** `'use client'`

Barra de navegación sticky con efecto glass al superar 50px de scroll. Muestra el logo con el nombre "Esencia Sevilla" y el número de registro turístico. En desktop presenta links de navegación que hacen scroll suave a las secciones (`#galeria`, `#reservar`, `#mapa`, `#resenas`, `#guia`). En móvil, un icono hamburguesa abre un overlay de menú completo con animación.

El **selector de idioma** muestra la bandera y nombre del locale activo; al abrirse despliega los 6 idiomas disponibles con sus banderas emoji. El cambio de idioma preserva la ruta actual mediante `useRouter().replace()` con el nuevo locale.

**Estado interno:**
- `isScrolled: boolean` — controla el efecto glass
- `isMenuOpen: boolean` — controla el overlay mobile
- `isLangOpen: boolean` — controla el dropdown de idioma

**Dependencias:** `usePathname`, `useRouter`, `useLocale` (next-intl), `useEffect`, `useState`

---

### 6.2 `Hero`

**Archivo:** `src/components/Hero.tsx`  
**Tipo:** `'use client'`

Sección de cabecera de pantalla completa con 5 funcionalidades principales:

**1. Carousel de imágenes**
- 5 fotos rotativas con intervalo de 4.500 ms
- Transición suave con `opacity` y `transform: scale`
- Indicadores de posición clicables (puntos)
- Gradiente negro progresivo para legibilidad del texto

**2. Contador de ahorro en tiempo real**
```typescript
// Calcula el ahorro para 3 noches, 2 personas como referencia
const { savings } = calculatePrice(tomorrow, in3Nights, 2);
// Muestra: "Ahorra €XX reservando directo"
```

**3. Badges de confianza**
- Valoración 4.9/5 con estrellas
- "+47 reseñas verificadas"
- "Wi-Fi Ultra rápido"
- "Auto check-in"
- Número de registro turístico AT/SE/03584

**4. CTAs principales**
- **Reservar directo** → scroll a `#reservar` con `window.scrollIntoView()`
- **Ver en Booking.com** → enlace externo (fallback/referencia)

**5. Row de monumentos cercanos**
- 8 monumentos con iconos emoji, nombre y tiempo a pie

---

### 6.3 `Gallery`

**Archivo:** `src/components/Gallery.tsx`  
**Tipo:** `'use client'`

Galería responsive de 12 fotos con CSS Grid. La primera imagen ocupa 2 columnas (`col-span-2`) para destacar la foto principal. Cada foto muestra un overlay con el nombre al hover (escala + opacidad).

**Lightbox:** Al hacer clic en cualquier foto se abre un Dialog de Radix UI en pantalla completa con:
- Foto ampliada con `next/image` (tamaño máximo)
- Botones prev/next con wrap-around circular
- Tira de miniaturas desplazable en la parte inferior
- Cierre con tecla ESC, click en overlay, o botón X
- Indicador `X / 12` en la esquina

**Optimización de imágenes:**
```typescript
// sizes attr para que Next.js genere srcset óptimo
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

---

### 6.4 `BookingSection`

**Archivo:** `src/components/BookingSection.tsx`  
**Tipo:** `'use client'`  
**ID HTML:** `reservar`

El componente más complejo de la aplicación. Gestiona el flujo completo de reserva en 5 pasos:

**Paso 1: Selección de tipo**
- Pestaña "Directo" (−10%, no reembolsable)
- Pestaña "Flexible" (a través de Booking.com, enlace externo)

**Paso 2: Selección de fechas**
```typescript
// react-day-picker en modo DateRange
const [dateRange, setDateRange] = useState<DateRange | undefined>();

// Al montar, carga fechas bloqueadas
useEffect(() => {
  fetch('/api/availability').then(r => r.json())
    .then(data => setBlockedDates(data.blockedDates.map(parseISO)));
}, []);
```

Las fechas bloqueadas se pasan como `disabled` al `DayPicker`. El calendario muestra la tabla de precios por temporada en el tooltip de días.

**Paso 3: Contador de huéspedes**
- Botones +/− con límite 1–4
- Recalcula tasa turística en tiempo real

**Paso 4: Extras (Upsells)**
```typescript
// 5 upsells definidos en src/data/apartment.ts
UPSELLS = [
  { id: 'airport-transfer', price: 35 },
  { id: 'welcome-pack',     price: 25 },
  { id: 'late-checkout',    price: 20 },
  { id: 'travel-cot',       price: 15 },
  { id: 'romantic-pack',    price: 45 },
]
```

**Paso 5: Cupón y checkout**
```typescript
// Validación de cupón en tiempo real (debounced 800ms)
const handleCouponCheck = async (code: string) => {
  const res = await fetch('/api/bookings/validate-coupon', {
    method: 'POST', body: JSON.stringify({ code })
  });
  const { valid, discountType, discountValue } = await res.json();
  // Actualiza el desglose de precio
};
```

**Desglose de precio mostrado:**
```
Noches (3 × €127,80)          €383,40
Tarifa de limpieza             €60,00
Tasa turística (2p × 3n)       €9,00
Pack bienvenida                €25,00
────────────────────────────────────
Descuento directo (−10%)      −€38,34
────────────────────────────────────
TOTAL (reserva directa)       €439,06
────────────────────────────────────
Precio estimado Booking.com   €483,00
Tu ahorro                      €43,94 ✓
```

---

### 6.5 `MapSection`

**Archivo:** `src/components/MapSection.tsx`  
**Tipo:** `'use client'` + `dynamic({ ssr: false })`

> Leaflet requiere acceso al objeto `window` y al DOM, por lo que no puede ejecutarse en el servidor. Se importa dinámicamente con `ssr: false`.

**Pestaña 1: Mapa**
- Mapa centrado en el apartamento (`[37.38862, -5.98230]`)
- Marcador especial con icono de casa (terracota)
- 10 marcadores de atracciones turísticas con colores por categoría:
  - 🏛️ Patrimonio / Monumental
  - 🌿 Parques y jardines
  - 🎭 Cultura y museos
  - 🍷 Gastronomía y ocio nocturno
- Al hacer clic en un marcador: popup con nombre, descripción y horarios
- Panel lateral derecho con lista de atracciones + tabs de filtro por categoría

**Pestaña 2: Rutas**
- 5 rutas turísticas con duración, dificultad y número de paradas
- Tarjeta de cada ruta con imagen y descripción breve
- Modal de detalle con la ruta completa, parada por parada
- Distancias y descripción de cada punto de interés en el idioma activo

**Pestaña 3: Transporte**
- Tabla de líneas de bus (EA, C3, C4, 24) con paradas más cercanas
- Información de la línea de Metro L1
- Tarjeta informativa sobre el billete Multiviaje

---

### 6.6 `ChatWidget`

**Archivo:** `src/components/ChatWidget.tsx`  
**Tipo:** `'use client'` + `dynamic({ ssr: false })`

**Botón flotante (FAB):** icono de chat con punto verde pulsante ("online").

**Ventana de chat:**
- Cabecera con nombre, estado online y botón de minimizar
- Area de mensajes con scroll automático al último mensaje
- Indicador de escritura animado (3 puntos rebotando)
- 4 sugerencias de preguntas predefinidas (chips clicables)
- Input de texto con envío por Enter o botón

**Flujo de mensaje:**
```typescript
const sendMessage = async (text: string) => {
  setMessages(prev => [...prev, { role: 'user', content: text }]);
  setIsTyping(true);
  
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }] })
  });
  
  const { content } = await res.json();
  setMessages(prev => [...prev, { role: 'assistant', content }]);
  setIsTyping(false);
};
```

**Sugerencias predefinidas** (localizadas):
- "¿Cómo llego desde el aeropuerto?"
- "¿Qué hay cerca del apartamento?"
- "¿Puedo cancelar la reserva?"
- "¿Hay aparcamiento cerca?"

---

### 6.7 `FAQ`

**Archivo:** `src/components/FAQ.tsx`  
**Tipo:** `'use client'`

20 preguntas frecuentes organizadas en categorías: Reservas, Check-in/out, El apartamento, Sevilla. Búsqueda en tiempo real que filtra tanto el título como el contenido de la respuesta. Acordeón animado con framer-motion. CTA de WhatsApp al pie para consultas no cubiertas.

---

### 6.8 `Reviews`

**Archivo:** `src/components/Reviews.tsx`  
**Tipo:** `'use client'`

Muestra las reseñas almacenadas en Supabase (solo las con `approved = true`). La valoración media y distribución por estrella se calculan en el cliente. Cada tarjeta de reseña incluye:
- Avatar con iniciales del autor (2 letras, fondo generado por hash del nombre)
- Bandera del país de procedencia
- Estrellas de valoración
- Texto con "Ver más" si supera 200 caracteres
- Fecha formateada en el locale activo
- Badge de fuente (Google, Booking.com, Airbnb, Directo)

---

## 7. Páginas y rutas

### 7.1 Página principal `[locale]/page.tsx`

Server Component que genera metadatos completos con `generateMetadata()`:

```typescript
export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return {
    title: t('seo.title'),           // "Apartamento en Sevilla Centro | Esencia Sevilla"
    description: t('seo.description'),
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
      locale: locale,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'es': `${siteUrl}/es`, 'en': `${siteUrl}/en`,
        'fr': `${siteUrl}/fr`, 'de': `${siteUrl}/de`,
        'it': `${siteUrl}/it`, 'pt': `${siteUrl}/pt`,
      }
    }
  };
}
```

Inyecta en el `<head>` los datos estructurados JSON-LD:
- `LodgingBusiness` — información del apartamento
- `AggregateRating` — valoración media
- `WebSite` con `SearchAction`
- `FAQPage` con las 20 preguntas

---

### 7.2 Guía turística `[locale]/guia/page.tsx`

Página estática offline-capable con:
- Header pegajoso con datos del apartamento (WiFi, horarios, contacto)
- MapSection embebido (solo modo mapa)
- Grid de 6 contactos de emergencia como enlaces `tel:`
- Reglas del apartamento en grid visual
- Instrucciones de checkout paso a paso
- QR de la propia página (para imprimir y dejar en el apartamento)

---

### 7.3 Panel de administración `[locale]/admin/page.tsx`

Acceso protegido con cookie `admin_auth`. Funcionalidades:

**Dashboard:**
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Ingresos mes    │ Ocupación        │ Precio medio     │ Nº reservas     │
│ €4.280          │ 73%              │ €142/noche       │ 8               │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

**Tabla de reservas:** con columnas: Ref, Huésped, Fechas, Huéspedes, Importe, Estado, Acciones.

**Gestión de bloqueos:** formulario para bloquear/desbloquear fechas manualmente con motivo.

**Generador de QR:** produce un QR de la URL `/[locale]/guia` con colores de marca. Descargable en PNG. Útil para imprimir y colocar en el apartamento.

---

### 7.4 Política de privacidad `[locale]/privacidad/page.tsx`

7 secciones completas conforme a RGPD y LOPDGDD:
1. Responsable del tratamiento (con datos del APARTMENT)
2. Datos que recabamos
3. Finalidad y base legal (Arts. 6.1.a, b, c RGPD)
4. Cesión de datos a terceros (Stripe, Supabase, Google Analytics, etc.)
5. Conservación de datos (plazos legales)
6. Derechos del usuario (ARCO+)
7. Política de cookies

---

## 8. API REST — Referencia completa

### `GET /api/availability`

Devuelve las fechas bloqueadas para los próximos 120 días.

**Headers:** ninguno requerido.

**Respuesta 200:**
```json
{
  "blockedDates": [
    "2026-05-10",
    "2026-05-11",
    "2026-05-12"
  ]
}
```

**Lógica interna:**
1. Comprueba caché en memoria (`Map<string, { data, expires }>`, TTL 5 min)
2. Si caché válido: devuelve datos cacheados (evita carga en Supabase)
3. Si caché expirado:
   - Consulta `blocked_dates` en Supabase donde `date BETWEEN today AND today+120`
   - Llama a `syncICalFeeds()` — descarga y parsea feeds de Booking.com y Airbnb
   - Hace `Set` para deduplicar
   - Actualiza caché y devuelve

**Fallback:** si Supabase no está disponible, devuelve un conjunto de fechas de demostración (próximos 7 días parcialmente bloqueados).

---

### `POST /api/bookings/checkout`

Crea una sesión de pago Stripe y persiste la reserva como `pending`.

**Headers:** `Content-Type: application/json`

**Body:**
```typescript
{
  checkIn: string;     // "YYYY-MM-DD" — fecha de entrada
  checkOut: string;    // "YYYY-MM-DD" — fecha de salida
  guests: number;      // 1-4
  upsells?: Array<{
    id: string;        // "airport-transfer" | "welcome-pack" | ...
    price: number;     // precio en EUR
    name: string;      // nombre localizado del extra
  }>;
  couponCode?: string; // código de cupón (opcional, se convierte a mayúsculas)
  locale?: string;     // "es" | "en" | ... (defecto: "es")
}
```

**Validación Zod:**
```typescript
const bookingSchema = z.object({
  checkIn:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests:     z.number().int().min(1).max(4),
  upsells:    z.array(z.object({
    id: z.string(), price: z.number(), name: z.string()
  })).optional().default([]),
  couponCode: z.string().optional(),
  locale:     z.string().default('es'),
});
```

**Respuesta 200:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "bookingRef": "ES-M0K3P1K-X2Y3"
}
```

**Respuestas de error:**
```json
// 400 — Validación fallida
{ "error": "Invalid booking data", "details": [...] }

// 400 — Estancia mínima no cumplida
{ "error": "Minimum stay is 2 nights" }

// 409 — Fechas no disponibles
{ "error": "Dates not available" }

// 500 — Error interno
{ "error": "Booking failed. Please try again." }
```

---

### `POST /api/bookings/validate-coupon`

Valida un código de cupón sin consumir un uso.

**Body:** `{ "code": "VERANO10" }`

**Lógica de validación:**
```typescript
// 1. Buscar en tabla coupons (case-insensitive via .toUpperCase())
// 2. Verificar active = true
// 3. Verificar valid_from <= NOW() (si existe)
// 4. Verificar valid_until >= NOW() (si existe)
// 5. Verificar uses_count < max_uses (si max_uses no es null)
```

**Respuesta 200 — Cupón válido:**
```json
{
  "valid": true,
  "discountType": "percent",   // "percent" | "fixed"
  "discountValue": 10,         // 10% descuento
  "discountAmount": null       // null si tipo percent; número si tipo fixed
}
```

**Respuesta 200 — Cupón inválido:**
```json
{ "valid": false }
```

---

### `POST /api/chat`

Proxy al modelo de IA vía OpenRouter.

**Body:**
```json
{
  "messages": [
    { "role": "user", "content": "¿Hay aparcamiento cerca?" }
  ]
}
```

**System prompt incluye:**
- Datos del apartamento (dirección, capacidad, amenities, normas)
- Precios y temporadas
- Instrucciones de llegada (aeropuerto SVQ, tren Santa Justa, coche)
- Transporte urbano (bus EA: 45 min aeropuerto, C3/C4: circular, Metro L1)
- Top 10 restaurantes del barrio por categoría
- Espectáculos de flamenco recomendados
- Eventos anuales 2026
- Contactos de emergencia
- Política de cancelación (no reembolsable si se reserva directo)

**Respuesta 200:**
```json
{ "content": "Sí, cerca del apartamento encontrarás varios parkings públicos..." }
```

**Respuesta si no hay API key (modo demo):**
```json
{ "content": "Hola, soy el asistente de Esencia Sevilla. Por favor, contacta directamente..." }
```

---

### `POST /api/webhooks/stripe`

Recibe eventos de Stripe. **No se puede llamar manualmente** (requiere firma HMAC-SHA256).

**Verificación de firma:**
```typescript
const sig = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
```

**Evento `checkout.session.completed`:**
```typescript
// 1. Extraer booking_ref de session.metadata
// 2. UPDATE bookings SET status='confirmed', guest_name=..., guest_email=...
// 3. INSERT INTO blocked_dates para cada noche de la estancia
// 4. Enviar email HTML de confirmación (Resend)
// 5. Enviar WhatsApp al propietario con resumen (Twilio)
```

**Evento `checkout.session.expired`:**
```typescript
// UPDATE bookings SET status='cancelled' WHERE booking_ref=...
```

**Respuestas:**
- `200 { received: true }` — procesado correctamente
- `400` — firma inválida
- `500` — error al procesar

---

### `POST /api/admin/auth`

**Body:** `{ "password": "..." }`

Compara con `process.env.ADMIN_PASSWORD`. Si coincide:
```typescript
response.cookies.set('admin_auth', 'true', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 8 * 60 * 60, // 8 horas
  path: '/',
});
```

**Respuesta 200:** `{ "success": true }`  
**Respuesta 401:** `{ "error": "Invalid password" }`

---

### `GET /api/admin/bookings`

Requiere cookie `admin_auth=true`.

**Parámetros query (opcionales):**
- `status` — filtrar por estado
- `from` — fecha inicio
- `to` — fecha fin

**Respuesta 200:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "booking_ref": "ES-M0K3P1K-X2Y3",
      "check_in": "2026-06-15",
      "check_out": "2026-06-20",
      "guests": 2,
      "guest_name": "Marie Dupont",
      "guest_email": "marie@example.fr",
      "total_amount": 439.06,
      "status": "confirmed",
      "upsells": [...],
      "created_at": "2026-04-20T10:30:00Z"
    }
  ]
}
```

---

### `POST /api/admin/block-date`

Requiere cookie `admin_auth=true`.

**Body:** `{ "date": "2026-07-15", "reason": "Mantenimiento fontanería" }`

Valida formato `YYYY-MM-DD` con regex Zod. Hace `upsert` en `blocked_dates` con `source: 'manual'`.

---

### `DELETE /api/admin/block-date`

**Body:** `{ "date": "2026-07-15" }`

Solo elimina registros con `source = 'manual'` (no puede eliminar fechas de reservas confirmadas).

---

## 9. Base de datos

### 9.1 Diagrama entidad-relación

```
┌─────────────────────┐        ┌──────────────────────┐
│      bookings       │        │    blocked_dates      │
│─────────────────────│        │──────────────────────│
│ id: UUID PK         │        │ id: UUID PK           │
│ booking_ref: TEXT   │───────►│ booking_ref: TEXT FK  │
│ check_in: DATE      │        │ date: DATE UNIQUE     │
│ check_out: DATE     │        │ reason: TEXT          │
│ guests: INTEGER     │        │ source: TEXT          │
│ guest_name: TEXT    │        │ created_at: TIMESTAMPTZ│
│ guest_email: TEXT   │        └──────────────────────┘
│ guest_phone: TEXT   │
│ total_amount: DEC   │        ┌──────────────────────┐
│ status: TEXT        │        │       coupons         │
│ payment_intent_id   │        │──────────────────────│
│ upsells: JSONB      │        │ id: UUID PK           │
│ coupon_code: TEXT   │        │ code: TEXT UNIQUE     │
│ discount_amount: DEC│        │ discount_type: TEXT   │
│ source: TEXT        │        │ discount_value: DEC   │
│ locale: TEXT        │        │ valid_from: DATE      │
│ pre_checkin_*       │        │ valid_until: DATE     │
│ created_at: TSZ     │        │ max_uses: INTEGER     │
│ updated_at: TSZ     │        │ uses_count: INTEGER   │
└─────────────────────┘        │ active: BOOLEAN       │
                               └──────────────────────┘
┌─────────────────────────────────────────────────┐
│                    reviews                       │
│─────────────────────────────────────────────────│
│ id: UUID PK                                      │
│ author: TEXT           country: TEXT             │
│ country_flag: TEXT     rating: INTEGER (1-5)     │
│ review_date: DATE      source: TEXT              │
│ text_es: TEXT          text_en: TEXT             │
│ text_fr: TEXT          text_de: TEXT             │
│ text_it: TEXT          text_pt: TEXT             │
│ approved: BOOLEAN      created_at: TIMESTAMPTZ   │
└─────────────────────────────────────────────────┘
```

### 9.2 Tabla `bookings` — detalle completo

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | ID interno |
| `booking_ref` | TEXT | UNIQUE NOT NULL | Ref legible (ES-XXXX-XXXX) |
| `check_in` | DATE | NOT NULL | Fecha de entrada |
| `check_out` | DATE | NOT NULL | Fecha de salida |
| `guests` | INTEGER | NOT NULL, DEFAULT 1 | Nº de huéspedes |
| `guest_name` | TEXT | NOT NULL | Nombre completo |
| `guest_email` | TEXT | NOT NULL | Email de contacto |
| `guest_phone` | TEXT | nullable | Teléfono |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Total cobrado en EUR |
| `status` | TEXT | CHECK IN ('pending','confirmed','cancelled','completed') | Estado de la reserva |
| `payment_intent_id` | TEXT | nullable | ID de PaymentIntent de Stripe |
| `upsells` | JSONB | DEFAULT '[]' | Array de extras: `[{id, name, price}]` |
| `coupon_code` | TEXT | nullable | Código de cupón aplicado |
| `discount_amount` | DECIMAL(10,2) | DEFAULT 0 | Total de descuento aplicado |
| `source` | TEXT | DEFAULT 'direct' | Origen de la reserva |
| `locale` | TEXT | DEFAULT 'es' | Idioma del proceso de reserva |
| `pre_checkin_completed` | BOOLEAN | DEFAULT FALSE | ¿Se completó el pre-check-in? |
| `pre_checkin_data` | JSONB | nullable | Datos del formulario (cifrados recomendado) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp de modificación |

**Ciclo de vida del campo `status`:**
```
pending ──── (Stripe completed) ──► confirmed ──── (stay ended) ──► completed
    └────── (Stripe expired) ──────► cancelled
```

### 9.3 Políticas RLS

```sql
-- Solo reseñas aprobadas son públicas
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT USING (approved = true);

-- Cualquiera puede leer fechas bloqueadas (para el calendario)
CREATE POLICY "Public read blocked dates"
  ON blocked_dates FOR SELECT USING (true);

-- Inserción pública de reservas (el pago se valida en el backend)
CREATE POLICY "Public insert bookings"
  ON bookings FOR INSERT WITH CHECK (true);

-- Los huéspedes pueden leer sus propias reservas
CREATE POLICY "Guest read own booking"
  ON bookings FOR SELECT USING (true);
```

### 9.4 Inicialización de la base de datos

El esquema SQL completo está en comentarios al final de `src/lib/supabase.ts`. Para ejecutarlo:

1. Acceder al panel de Supabase → SQL Editor
2. Copiar y pegar el bloque `/* ... */` del archivo
3. Ejecutar — creará las 4 tablas con índices y políticas RLS

---

## 10. Motor de precios

### 10.1 Función `calculatePrice()`

```typescript
function calculatePrice(
  checkIn: Date,
  checkOut: Date,
  guests: number,
  upsellsTotal = 0,
  discountPercent = 0,    // defecto: 10% para reserva directa
  couponDiscount = 0
): PriceBreakdown
```

### 10.2 Algoritmo de cálculo

```
1. nights = differenceInCalendarDays(checkOut, checkIn)

2. pricePerNight = APARTMENT.basePricePerNight  // €142

3. subtotal = nights × pricePerNight

4. cleaningFee = APARTMENT.cleaningFee  // €60

5. touristTax = guests × nights × APARTMENT.touristTaxPerPersonNight  // €1,50

6. discount = floor(subtotal × discountPercent/100) + couponDiscount

7. total = subtotal + cleaningFee + touristTax + upsellsTotal − discount

8. bookingPrice = round(total × 1.1)  // estimación OTA (+10%)

9. savings = bookingPrice − total     // ahorro visible al usuario
```

### 10.3 Multiplicadores de temporada

```typescript
function getSeasonMultiplier(date: Date): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 25) || (month === 4 && day <= 10)) return 1.5; // Semana Santa
  if (month === 4 && day >= 15 && day <= 30) return 1.5;  // Feria de Abril
  if (month >= 6 && month <= 8) return 1.25;              // Verano
  if (month === 12 && day >= 22) return 1.30;             // Navidad/NYE
  if ((month >= 3 && month <= 5) || (month >= 9 && month <= 11)) return 1.0; // Media temp.
  return 0.85;                                             // Invierno
}
```

| Período | Multiplicador | Precio/noche | Precio OTA estimado |
|---|---|---|---|
| Semana Santa (25 mar–10 abr) | ×1,5 | ~€213 | ~€234 |
| Feria de Abril (15–30 abr) | ×1,5 | ~€213 | ~€234 |
| Verano (jun–ago) | ×1,25 | ~€178 | ~€196 |
| Navidad / Nochevieja (22–31 dic) | ×1,30 | ~€185 | ~€204 |
| Primavera / Otoño | ×1,0 | €142 | ~€156 |
| Invierno (ene–feb) | ×0,85 | ~€121 | ~€133 |

### 10.4 Tabla de upsells

| ID | Nombre | Precio | Descripción |
|---|---|---|---|
| `airport-transfer` | Traslado aeropuerto | €35 | Transfer SVQ ↔ apartamento |
| `welcome-pack` | Pack bienvenida local | €25 | Productos artesanales sevillanos |
| `late-checkout` | Late check-out | €20 | Salida hasta las 14:00 h |
| `travel-cot` | Cuna de viaje | €15 | Para bebés y niños pequeños |
| `romantic-pack` | Pack romántico | €45 | Vino local, flores y decoración |

---

## 11. Internacionalización

### 11.1 Configuración

```typescript
// src/i18n.ts
export const locales = ['es', 'en', 'fr', 'de', 'it', 'pt'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español', en: 'English', fr: 'Français',
  de: 'Deutsch', it: 'Italiano', pt: 'Português',
};

export const localeFlags: Record<Locale, string> = {
  es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷',
  de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹',
};
```

### 11.2 Estructura de rutas

```
/ ─────────────────────► redirect a /es (o al locale del navegador)
/es ───────────────────► Página principal en español
/en ───────────────────► Página principal en inglés
/fr/guia ──────────────► Guía turística en francés
/de/admin ─────────────► Panel de admin en alemán
```

### 11.3 Namespaces de traducciones

| Namespace | Claves aprox. | Contenido |
|---|---|---|
| `nav` | 8 | Links de navegación |
| `hero` | 12 | Textos del hero y badges |
| `comparison` | 15 | Tabla comparativa Booking.com |
| `booking` | 35 | Todo el flujo de reserva |
| `gallery` | 5 | Galería fotográfica |
| `map` | 25 | Mapa, categorías, transporte |
| `events` | 20 | Eventos de Sevilla |
| `reviews` | 8 | Sección de reseñas |
| `faq` | 60 | 20 preguntas × (título + respuesta + categoría) |
| `location` | 20 | Localización e instrucciones |
| `chat` | 10 | Chatbot: saludo, sugerencias |
| `guestPortal` | 25 | Portal de huéspedes / pre-check-in |
| `welcomeBook` | 30 | Libro de bienvenida |
| `footer` | 12 | Footer y links legales |
| `admin` | 20 | Panel de administración |
| `seo` | 15 | Meta títulos y descripciones |

### 11.4 Localización de fechas

`date-fns` proporciona locales nativos para los 6 idiomas:

```typescript
const dateFnsLocales = { es, en: enUS, fr, de, it, pt };

// En DayPicker
<DayPicker locale={dateFnsLocales[currentLocale]} />

// En formateo de fechas
format(date, 'PP', { locale: dateFnsLocales[currentLocale] });
// es: "20 de abril de 2026"
// en: "April 20, 2026"
// de: "20. April 2026"
```

---

## 12. Pasarela de pago (Stripe)

### 12.1 Configuración

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});
```

### 12.2 `createCheckoutSession()`

```typescript
export async function createCheckoutSession(params: CheckoutParams) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    payment_method_options: {
      card: { request_three_d_secure: 'automatic' }
    },
    allow_promotion_codes: false, // cupones gestionados internamente
    line_items: buildLineItems(params),
    customer_email: params.guestEmail || undefined,
    locale: params.locale as Stripe.Checkout.SessionCreateParams.Locale,
    billing_address_collection: 'required',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      booking_ref: params.bookingRef,
      check_in: params.checkIn,
      check_out: params.checkOut,
      guests: String(params.guests),
    },
  });
}
```

### 12.3 Métodos de pago soportados

| Método | Región | Notas |
|---|---|---|
| Tarjeta de crédito/débito | Global | Visa, Mastercard, Amex |
| Apple Pay | Safari / iOS | Activado automáticamente por Stripe |
| Google Pay | Chrome / Android | Activado automáticamente por Stripe |
| Bizum | España | Requiere activación manual en Stripe Dashboard |
| SEPA Direct Debit | Europa | Añadir a `payment_method_types` |

### 12.4 Testing

```bash
# Tarjetas de prueba
4242 4242 4242 4242  → Pago exitoso
4000 0025 0000 3155  → Requiere autenticación 3D Secure
4000 0000 0000 9995  → Pago rechazado (fondos insuficientes)

# Escuchar webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 13. Sistema de disponibilidad e iCal

### 13.1 Flujo de sincronización

```
GET /api/availability
       │
       ├─ ¿Cache válido? (< 5 min) ──► Return cached
       │
       └─ Cache expirado:
              │
              ├─ Supabase: SELECT date FROM blocked_dates
              │            WHERE date BETWEEN today AND today+120
              │
              ├─ Fetch ICAL_BOOKING_URL (si configurado)
              │         │
              │         └─ parseICalBlocked(text) → string[]
              │
              ├─ Fetch ICAL_AIRBNB_URL (si configurado)
              │         │
              │         └─ parseICalBlocked(text) → string[]
              │
              └─ Set dedup → [ ...supabase, ...booking, ...airbnb ]
```

### 13.2 Parser iCal (`parseICalBlocked`)

```typescript
function parseICalBlocked(icalText: string): string[] {
  const blocked: string[] = [];
  // Itera línea a línea buscando BEGIN:VEVENT ... END:VEVENT
  // Extrae DTSTART y DTEND (formatos: YYYYMMDD o YYYY-MM-DDTHH:MM:SSZ)
  // Genera todas las fechas del rango [start, end) en formato YYYY-MM-DD
  return blocked;
}
```

**Formato de fechas soportados:**
- `DTSTART:20260615` — solo fecha (all-day)
- `DTSTART;TZID=Europe/Madrid:20260615T160000` — con zona horaria
- `DTSTART:20260615T160000Z` — UTC

### 13.3 Configurar en las OTAs

**Booking.com:**
1. Panel de partner → Propiedades → Calendario → Sincronización
2. "Exportar mi disponibilidad" → Copiar URL iCal
3. Añadir a `ICAL_BOOKING_URL` en `.env.local`

**Airbnb:**
1. Gestiona anuncios → Disponibilidad → Exportar calendario
2. Copiar enlace iCal
3. Añadir a `ICAL_AIRBNB_URL` en `.env.local`

---

## 14. IA conversacional (Chatbot)

### 14.1 Arquitectura

```
Frontend (ChatWidget) → POST /api/chat → OpenRouter API → Modelo IA
                                                            ↑
                                              System Prompt (context)
```

### 14.2 System Prompt

El prompt del sistema codifica el conocimiento completo del apartamento y Sevilla:

```
Eres el asistente virtual de Esencia Sevilla, un apartamento de lujo en el
centro histórico de Sevilla. Ayudas a los huéspedes con información sobre:

APARTAMENTO:
- Dirección: Imaginero Luis Alvarez Duarte N7, 41008 Sevilla
- WiFi: EsenciaSevilla_5G
- Check-in: 16:00 | Check-out: 11:00
- Capacidad: 4 huéspedes | 2 dormitorios | 65 m²
- Caja de llaves: código proporcionado por email tras la reserva

PRECIOS:
- Desde €142/noche + €60 limpieza + €1,50 tasa turística/persona/noche
- Descuento 10% reservando en la web vs Booking.com/Airbnb

TRANSPORT:
- Aeropuerto SVQ: Bus EA desde Terminal hasta Prado de San Sebastián (45 min, €4)
- Tren Santa Justa: Metro L1 o bus C3/C4 (15 min)
- ...

RESTAURANTES RECOMENDADOS:
- Casa Morales (calle García de Vinuesa) — Taberna histórica
- El Rinconcillo (c/ Gerona 40) — Más antigua de Sevilla (1670)
- ...
```

### 14.3 Modelo utilizado

Por defecto: `claude-3-haiku-20240307` (rápido y económico). Configurable en `src/app/api/chat/route.ts` para usar Claude Sonnet, GPT-4, Mistral, etc.

---

## 15. SEO y datos estructurados

### 15.1 JSON-LD — LodgingBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Esencia Sevilla",
  "url": "https://esenciasevilla.com",
  "image": "https://esenciasevilla.com/og-image.jpg",
  "description": "Apartamento turístico en el centro histórico de Sevilla...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Imaginero Luis Alvarez Duarte N7",
    "addressLocality": "Sevilla",
    "postalCode": "41008",
    "addressCountry": "ES"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 37.38862, "longitude": -5.98230 },
  "telephone": "+34600000000",
  "email": "hola@esenciasevilla.com",
  "priceRange": "€€",
  "numberOfRooms": 2,
  "occupancy": { "@type": "QuantitativeValue", "maxValue": 4 },
  "amenityFeature": [...],
  "tourismType": "VacationRental"
}
```

### 15.2 Sitemap dinámico

`src/app/sitemap.ts` genera 30 URLs:

```typescript
const pages = ['', '/guia', '/blog', '/privacidad', '/terminos'];
const priorities = { '': 1.0, '/guia': 0.8, '/blog': 0.7, '/privacidad': 0.3 };

// Para cada locale × página:
{
  url: `${siteUrl}/${locale}${page}`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: priorities[page] || 0.5,
  alternates: {
    languages: { es: '...', en: '...', fr: '...', de: '...', it: '...', pt: '...' }
  }
}
```

### 15.3 Checklist SEO post-despliegue

- [ ] Google Search Console — verificar propiedad y enviar sitemap
- [ ] Bing Webmaster Tools — verificar propiedad
- [ ] Google Analytics 4 — verificar eventos de conversión
- [ ] Test Rich Results: https://search.google.com/test/rich-results
- [ ] Test hreflang: https://www.hreflang.org/checker/
- [ ] PageSpeed Insights: https://pagespeed.web.dev
- [ ] Ahrefs / Semrush — monitorear posicionamiento

---

## 16. PWA y Service Worker

### 16.1 Web App Manifest

```json
{
  "name": "Esencia Sevilla",
  "short_name": "Esencia Sevilla",
  "description": "Apartamento turístico en el centro de Sevilla",
  "start_url": "/es",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#C25A3A",
  "background_color": "#F7F0E3",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "shortcuts": [
    { "name": "Reservar", "url": "/es#reservar", "icons": [...] },
    { "name": "Guía turística", "url": "/es/guia", "icons": [...] }
  ]
}
```

### 16.2 Estrategias de caché Workbox

| Recurso | Estrategia | TTL |
|---|---|---|
| HTML (páginas) | NetworkFirst | — |
| Fuentes | CacheFirst | 30 días |
| Imágenes | CacheFirst | 7 días |
| CSS/JS | StaleWhileRevalidate | — |
| `/es/guia` | CacheFirst | 7 días (offline) |

---

## 17. Panel de administración

### 17.1 Autenticación

Cookie httpOnly `admin_auth=true`, duración 8 horas. No hay roles múltiples en v1.0 — solo el propietario accede con la contraseña definida en `ADMIN_PASSWORD`.

### 17.2 Dashboard de estadísticas

Las métricas se calculan en el cliente sobre los datos de reservas:

```typescript
const revenue = bookings
  .filter(b => b.status === 'confirmed' && isThisMonth(b.check_in))
  .reduce((sum, b) => sum + b.total_amount, 0);

const occupancyRate = (confirmedNights / daysInMonth) * 100;
const avgPricePerNight = revenue / confirmedNights;
```

### 17.3 Generación de QR

```typescript
import QRCode from 'qrcode';

const qrDataUrl = await QRCode.toDataURL(
  `${siteUrl}/${locale}/guia`,
  {
    width: 300,
    margin: 2,
    color: { dark: '#2B1E15', light: '#F7F0E3' },
    errorCorrectionLevel: 'M',
  }
);
// Se muestra en <img src={qrDataUrl} />
// Descarga: <a download="guia-esencia-sevilla.png" href={qrDataUrl}>
```

---

## 18. Notificaciones y comunicación

### 18.1 Email de confirmación (Resend)

Enviado tras `checkout.session.completed`. Template HTML incluye:
- Logotipo y nombre del apartamento
- Datos de la reserva (ref, fechas, nº huéspedes)
- Total pagado con desglose
- Extras contratados
- Instrucciones de llegada (código de la caja de llaves)
- Link al pre-check-in digital
- Información de contacto del propietario
- Mapa de ubicación

### 18.2 Notificación WhatsApp (Twilio)

Al propietario (+34 600 000 000) se envía:
```
🏡 Nueva reserva Esencia Sevilla

Ref: ES-M0K3P1K-X2Y3
Huésped: Marie Dupont (marie@example.fr)
Fechas: 15 jun – 20 jun (5 noches)
Huéspedes: 2
Total: €439,06
Extras: Pack bienvenida (€25)
```

---

## 19. Analytics y seguimiento

### 19.1 Google Analytics 4

Eventos de conversión configurados:

| Evento | Trigger |
|---|---|
| `page_view` | Automático |
| `view_item` | Al cargar la página de inicio |
| `begin_checkout` | Al hacer clic en "Reservar directo" |
| `purchase` | En `/reserva-confirmada` con `transaction_id` y `value` |
| `chat_open` | Al abrir el ChatWidget |
| `chat_message` | Al enviar un mensaje |

### 19.2 Meta Pixel (Facebook/Instagram Ads)

Eventos estándar:
- `ViewContent` — en página de inicio
- `InitiateCheckout` — al iniciar la reserva
- `Purchase` — al confirmar el pago

---

## 20. Seguridad

### 20.1 Superficie de ataque y mitigaciones

| Vulnerabilidad | Vector | Mitigación |
|---|---|---|
| **SQL Injection** | API routes con parámetros de usuario | Supabase usa queries parametrizadas; nunca string interpolation en SQL |
| **XSS** | Contenido dinámico en React | React escapa HTML por defecto; no se usa `dangerouslySetInnerHTML` |
| **CSRF** | Peticiones cross-site a API | Stripe webhooks con HMAC-SHA256; admin cookie SameSite=Strict |
| **Price Tampering** | Manipulación del precio en el frontend | El precio se calcula completamente en el servidor; el cliente solo envía fechas |
| **Admin Bruteforce** | Ataques de fuerza bruta al login admin | Recomendado: añadir rate limiting (Upstash, Cloudflare) |
| **Cookie Hijacking** | Robo de cookie de sesión admin | httpOnly + Secure + SameSite=Strict |
| **Secrets Exposure** | Variables de entorno en bundle cliente | Claves sensibles NUNCA tienen prefijo `NEXT_PUBLIC_` |
| **Coupon Abuse** | Uso múltiple de cupones | Validación en servidor; incremento atómico de `uses_count` |
| **iCal SSRF** | URLs iCal maliciosas | Solo URLs de Booking.com y Airbnb admitidas vía variables de entorno |
| **Stripe Replay** | Replay de webhooks firmados | `stripe.webhooks.constructEvent()` valida timestamp (tolerancia 5 min) |

### 20.2 Headers de seguridad recomendados

Añadir en `next.config.mjs`:

```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]
  }];
}
```

---

## 21. Cumplimiento legal (RGPD)

### 21.1 Bases legales por tratamiento

| Tratamiento | Base legal | Artículo RGPD |
|---|---|---|
| Gestión de reservas | Ejecución del contrato | Art. 6.1.b |
| Registro de viajeros | Obligación legal (Ley 4/2015) | Art. 6.1.c |
| Comunicaciones reserva | Ejecución del contrato | Art. 6.1.b |
| Marketing/newsletter | Consentimiento | Art. 6.1.a |
| Google Analytics | Interés legítimo | Art. 6.1.f |

### 21.2 Transferencias internacionales

| Servicio | País | Garantía |
|---|---|---|
| Stripe | EE.UU. | Privacy Shield / SCCs |
| Supabase | UE (Frankfurt) | RGPD directo |
| OpenRouter | EE.UU. | SCCs |
| Twilio | EE.UU. | Privacy Shield |
| Google Analytics | EE.UU. | Datos anonimizados |

---

## 22. Variables de entorno

### 22.1 Tabla completa

| Variable | Requerida | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL base (ej. `https://esenciasevilla.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Clave de servicio (solo backend) |
| `STRIPE_SECRET_KEY` | ✅ | Clave secreta Stripe (`sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Clave pública Stripe (`pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Secreto para verificar webhooks |
| `OPENROUTER_API_KEY` | ✅ | Clave API de OpenRouter |
| `ADMIN_PASSWORD` | ✅ | Contraseña del panel admin (mín. 12 chars) |
| `RESEND_API_KEY` | ⚠️ Prod | Clave API Resend para emails |
| `TWILIO_ACCOUNT_SID` | ⚠️ Prod | SID de cuenta Twilio |
| `TWILIO_AUTH_TOKEN` | ⚠️ Prod | Token de autenticación Twilio |
| `ICAL_BOOKING_URL` | ⚠️ Prod | URL iCal de Booking.com |
| `ICAL_AIRBNB_URL` | ⚠️ Prod | URL iCal de Airbnb |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ⚠️ Prod | ID de Google Analytics 4 (`G-XXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | ⚠️ Prod | ID del Meta Pixel |

---

## 23. Despliegue

### 23.1 Vercel (recomendado)

```bash
# Instalar CLI
npm i -g vercel

# Primer despliegue
cd esencia-sevilla
vercel --prod

# Despliegues posteriores (desde GitHub automáticamente)
```

**Configuración en el dashboard:**
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Root Directory: `esencia-sevilla` (si el repo incluye la carpeta padre)
- Node.js Version: **20.x**

### 23.2 Self-hosted (VPS / servidor propio)

```bash
# 1. Clonar e instalar
git clone https://github.com/danimap27/esencia-sevilla
cd esencia-sevilla
npm install

# 2. Configurar entorno
cp .env.example .env.local
nano .env.local  # Rellenar todas las variables

# 3. Ejecutar esquema de BD en Supabase SQL Editor
# (copiar contenido del comentario en src/lib/supabase.ts)

# 4. Construir y arrancar
npm run build
npm start
# → http://localhost:3000

# 5. (Opcional) Con PM2 para mantener el proceso activo
npm install -g pm2
pm2 start npm --name "esencia-sevilla" -- start
pm2 save && pm2 startup
```

### 23.3 NGINX como reverse proxy

```nginx
server {
    listen 443 ssl http2;
    server_name esenciasevilla.com www.esenciasevilla.com;

    ssl_certificate     /etc/letsencrypt/live/esenciasevilla.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/esenciasevilla.com/privkey.pem;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name esenciasevilla.com;
    return 301 https://$host$request_uri;
}
```

---

## 24. Testing

### 24.1 Estado actual (v1.0)

La versión 1.0 no incluye una suite de tests automatizados. La cobertura se realiza manualmente siguiendo los casos de uso descritos en el DEPLOY.md.

### 24.2 Estrategia de testing recomendada

**Unit tests (Vitest):**
```typescript
// src/lib/utils.test.ts
describe('calculatePrice', () => {
  it('should apply 10% direct discount', () => {
    const result = calculatePrice(checkIn, checkOut, 2, 0, 10, 0);
    expect(result.discount).toBe(Math.floor(result.subtotal * 0.1));
  });

  it('should estimate booking.com at +10%', () => {
    const result = calculatePrice(checkIn, checkOut, 2);
    expect(result.bookingPrice).toBe(Math.round(result.total * 1.1));
  });
});
```

**Integration tests (Playwright):**
- Flujo completo de reserva con tarjeta de test Stripe
- Validación de cupones
- Chat widget: enviar mensaje y recibir respuesta
- Cambio de idioma: verificar que todos los textos cambian

---

## 25. Rendimiento y Core Web Vitals

### 25.1 Objetivos de métricas

| Métrica | Objetivo | Técnica |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2,5 s | `priority` en hero image, formato AVIF/WebP |
| **CLS** (Cumulative Layout Shift) | < 0,1 | Dimensiones explícitas en todas las imágenes |
| **FID/INP** | < 100 ms | Carga dinámica de Leaflet y ChatWidget |
| **TTFB** | < 0,8 s | React Server Components para páginas estáticas |
| **FCP** | < 1,8 s | Fuentes cargadas con `display: optional` |

### 25.2 Optimizaciones implementadas

- `next/image` con `sizes`, `priority`, formatos AVIF/WebP automáticos
- `dynamic(() => import(...), { ssr: false })` para componentes con dependencias de DOM
- Google Fonts con `next/font/google` (autohost, eliminación de peticiones externas)
- Tailwind CSS purge en build (< 15 KB CSS en producción)
- Caché de disponibilidad en memoria (evita N queries a Supabase por petición)
- Service Worker con estrategias Workbox para recursos estáticos

---

## 26. Trabajo futuro

Esta sección describe la hoja de ruta completa del producto: mejoras técnicas, nuevas funcionalidades, optimizaciones de negocio y visión a largo plazo.

---

### 26.1 Corto plazo — v1.1 (1–3 meses)

#### 26.1.1 Páginas pendientes de implementar

**Términos y Condiciones** (`/[locale]/terminos`)  
Página legal requerida por RGPD y la normativa turística andaluza. Debe cubrir: política de cancelación (no reembolsable, por ser reserva directa con descuento del 10%), responsabilidades, datos del responsable, legislación aplicable.

**Confirmación de reserva** (`/[locale]/reserva-confirmada`)  
Página de éxito tras el pago, accesible con `?ref=ES-XXXX&session_id=...`. Muestra: resumen de la reserva, próximos pasos (pre-check-in, instrucciones de llegada), descarga de comprobante en PDF, y acceso al portal de huéspedes.

**Blog** (`/[locale]/blog` y `/[locale]/blog/[slug]`)  
Blog turístico con artículos sobre Sevilla (gastronomía, eventos, rutas). Objetivo: tráfico orgánico SEO de cola larga. Estructura: listado con cards + páginas de artículo con JSON-LD `Article`. Los posts se definen en `src/data/blog-posts.ts`.

**Portal de huéspedes / Pre-check-in** (`/[locale]/portal/[bookingRef]`)  
Formulario de pre-check-in con los datos exigidos por la Ley de Seguridad Ciudadana para SES.HOSPEDERÍA:
- DNI/pasaporte (número, fecha de expedición, país)
- Fecha de nacimiento
- Nacionalidad
- Dirección de procedencia
Los datos se cifran en tránsito y se almacenan en `bookings.pre_checkin_data` (JSONB). Opcionalmente se envían automáticamente a SES.HOSPEDERÍA vía API.

#### 26.1.2 Banner de cookies RGPD

Implementar un banner conforme a RGPD:
- Primer nivel: aceptar / rechazar todo / gestionar preferencias
- Categorías: Esenciales, Analytics (GA4), Marketing (Meta Pixel)
- Persistencia en `localStorage`
- Carga condicional de scripts de analytics solo tras aceptación
- Considerar: `react-cookie-consent` o implementación propia con Radix Dialog

#### 26.1.3 Mejoras del sistema de cupones (panel admin)

Interfaz de creación de cupones desde el panel de administración:
```
Nueva campaña de cupones:
├── Código: [VERANO2026]
├── Tipo: [% Porcentaje] [€ Fijo]
├── Valor: [10]%
├── Válido desde: [01/06/2026]
├── Válido hasta: [31/08/2026]
└── Usos máximos: [50]
```

#### 26.1.4 Fotos del apartamento

Añadir las 12 fotos reales del apartamento a `public/fotos/`:
- Formato preferido: WebP con fallback JPG
- Resolución: 1200×800px (16:10) para la galería
- Tamaños adicionales: 800×533, 400×267 para srcset
- Foto OG: `public/og-image.jpg` (1200×630px)
- Script de optimización: `sharp` o Squoosh CLI para conversión batch

#### 26.1.5 Emails HTML con diseño de marca

Actualmente los emails de confirmación son texto plano. Diseñar plantillas HTML con:
- Logo y colores de Esencia Sevilla
- Tabla de desglose del precio
- Mapa de ubicación embebido
- Botón CTA para el pre-check-in
- Links a la guía turística y chatbot
- Footer con datos RGPD y contacto

---

### 26.2 Medio plazo — v1.2 (3–6 meses)

#### 26.2.1 Precios dinámicos por noche en el calendario

Actualmente el precio base es fijo (€142). Implementar precios dinámicos visibles en el DayPicker: cada día del calendario muestra el precio correspondiente a su temporada.

```typescript
// BookingSection — renderDayContent
const renderDay = (day: Date) => {
  const price = getDynamicPrice(day);  // usa getSeasonMultiplier()
  return (
    <div>
      <span>{day.getDate()}</span>
      <span className="text-xs text-terracota-600">€{price}</span>
    </div>
  );
};
```

Esto requiere actualizar `calculatePrice()` para sumar el precio dinámico de cada noche en lugar de multiplicar el precio base por el número de noches.

#### 26.2.2 Sistema de reseñas con moderación

**Solicitud automática de reseña:** 3 días después del check-out, enviar email al huésped con enlace a un formulario de reseña público (`/[locale]/opinar/[bookingRef]`).

**Formulario de reseña:**
- Valoración con estrellas (1–5)
- Texto libre (máximo 500 caracteres)
- Idioma autodetectado
- Token único en la URL para evitar spam

**Moderación en el admin:** tabla de reseñas pendientes con botones "Aprobar" / "Rechazar". Solo las aprobadas se muestran en el sitio web.

**Integración con Google Business Profile:** tras aprobación, sugerir al huésped que comparta la reseña en Google (enlace directo al perfil de Google Business).

#### 26.2.3 Portal de huéspedes completo

Expandir el portal de pre-check-in a una experiencia completa del huésped:

```
Portal del Huésped (acceso con bookingRef + email)
├── Pre-check-in digital (datos SES.HOSPEDERÍA)
├── Información de la estancia
│   ├── Código de la caja de llaves
│   ├── WiFi: EsenciaSevilla_5G / clave: ...
│   └── Instrucciones de llegada
├── Guía del apartamento
│   ├── Cómo funciona el climatizador
│   ├── Cómo usar la lavadora
│   └── Normas del apartamento
├── Guía turística personalizada
│   ├── Recomendaciones según las fechas (Feria, Semana Santa...)
│   └── Reservas de restaurantes (integracion con TheFork/Google)
├── Chat con el propietario
└── Checkout digital (checklist de salida)
```

#### 26.2.4 Rate limiting en las APIs

Implementar limitación de velocidad para proteger contra abuso:

```typescript
// Con Upstash Ratelimit (Redis)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'),
});

// En /api/chat:
const { success } = await ratelimit.limit(req.ip);
if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
```

Límites recomendados:
- `/api/chat`: 10 peticiones/minuto por IP
- `/api/bookings/checkout`: 5 peticiones/minuto por IP
- `/api/availability`: 30 peticiones/minuto por IP

#### 26.2.5 Testing automatizado

**Suite de unit tests con Vitest:**
- `calculatePrice()` — todos los casos de precio
- `parseICalBlocked()` — distintos formatos de fecha iCal
- `getSeasonMultiplier()` — fechas de temporada
- `generateBookingId()` — formato correcto

**E2E con Playwright:**
- Flujo de reserva completo (con Stripe test mode)
- Cambio de idioma y verificación de traducciones
- Admin login + bloqueo de fecha
- Chat widget

**Integración continua (GitHub Actions):**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

---

### 26.3 Largo plazo — v2.0 (6–18 meses)

#### 26.3.1 Aplicación móvil nativa (React Native / Expo)

App dedicada para huéspedes disponible en App Store y Google Play:

```
Esencia Sevilla App
├── Onboarding con la reserva
├── Llave digital (NFC / código QR)
├── Chat en tiempo real con el propietario
├── Guía turística offline (mapas descargados)
├── Notificaciones push:
│   ├── Recordatorio de check-in
│   ├── Código de acceso (24h antes)
│   └── Solicitud de reseña (tras check-out)
└── Historial de estancias
```

**Stack sugerido:** Expo SDK 51 + React Native, Supabase Realtime para chat, Expo Notifications para push.

#### 26.3.2 Yield Management / Revenue Management

Sistema de precios dinámicos basado en demanda real:

**Datos de entrada:**
- Ocupación histórica por fecha/temporada
- Precios de la competencia (scraping de Booking.com)
- Lead time de las reservas (¿cuántos días antes suele reservarse?)
- Clima del mercado (eventos, festivos)

**Algoritmo de pricing:**
```typescript
function calculateOptimalPrice(date: Date, demandScore: number): number {
  const baseSeason = getSeasonMultiplier(date);
  const daysUntilDate = differenceInCalendarDays(date, new Date());
  const urgencyMultiplier = daysUntilDate < 7 ? 1.2 : daysUntilDate < 30 ? 1.1 : 1.0;
  const occupancyMultiplier = demandScore > 0.8 ? 1.15 : demandScore < 0.3 ? 0.9 : 1.0;
  return Math.round(APARTMENT.basePricePerNight * baseSeason * urgencyMultiplier * occupancyMultiplier);
}
```

**Dashboard de revenue management** en el panel de admin con:
- Calendario de precios editable día a día
- Gráfico de ingresos vs ocupación
- Comparativa con precios de Booking.com en tiempo real
- Sugerencias automáticas de ajuste de precio

#### 26.3.3 Soporte para múltiples propiedades

Escalar el sistema para gestionar varios apartamentos:

**Cambios en la BD:**
```sql
CREATE TABLE properties (
  id UUID PK,
  slug TEXT UNIQUE,        -- 'esencia-sevilla', 'luz-triana', etc.
  owner_id UUID FK,
  name TEXT,
  address TEXT,
  base_price DECIMAL,
  -- ...metadata
);

ALTER TABLE bookings ADD COLUMN property_id UUID FK REFERENCES properties(id);
ALTER TABLE blocked_dates ADD COLUMN property_id UUID FK;
```

**Routing multi-propiedad:**
```
/[locale]/[property]/             # Página de cada propiedad
/[locale]/[property]/#reservar    # Reserva por propiedad
/[locale]/admin/properties/       # Lista de propiedades en el admin
```

**Autenticación multiusuario:** migrar de cookie simple a Supabase Auth con roles (propietario, gestor, limpiador).

#### 26.3.4 Integraciones con channel managers

Conectar con sistemas profesionales de gestión de canales:

| Sistema | Integración | Beneficio |
|---|---|---|
| **Lodgify** | API REST | Gestión unificada de canales |
| **Hostaway** | API REST | Sincronización bidireccional en tiempo real |
| **Beds24** | iCal + API | Precio dinámico en todos los canales |
| **Guesty** | Webhook | Automatización de operaciones |
| **Smoobu** | API REST | Todo-en-uno para propietarios pequeños |

#### 26.3.5 Integración con casa inteligente (IoT)

Control del apartamento en tiempo real:

**Funcionalidades:**
- **Cerradura inteligente:** generar código temporal para cada huésped (válido desde el check-in hasta el check-out), enviado por email y disponible en el portal del huésped
- **Termostato:** preconfigurar temperatura 1 hora antes del check-in
- **Sensores de ruido:** alerta automática al propietario si se detecta ruido > threshold en horario de silencio
- **Detector de CO₂:** notificación si los niveles son preocupantes

**Stack sugerido:** Home Assistant + API REST, Nuki Smart Lock para la cerradura, Milesight IoT sensors.

#### 26.3.6 Chatbot IA avanzado con RAG

Mejorar el chatbot con Retrieval-Augmented Generation:

**Base de conocimiento dinámica:**
- Menús actualizados de restaurantes cercanos
- Horarios reales de atracciones turísticas (scraping semanal)
- Eventos locales en tiempo real (API de cultura del Ayuntamiento de Sevilla)
- Estado del clima para la semana de la estancia

**Historial de conversación persistente:** guardar conversaciones en Supabase para que el bot recuerde el contexto entre sesiones.

**Escalado a operador humano:** si la IA no puede responder con suficiente confianza (score < threshold), transferir la conversación a WhatsApp del propietario automáticamente.

**Soporte multimodal:** permitir envío de fotos al bot ("¿Qué es esto?", "Aquí está el panel del climatizador") para soporte visual.

#### 26.3.7 Dashboard de Business Intelligence

Panel de análisis avanzado para el propietario:

**Módulos:**
```
BI Dashboard
├── Ingresos
│   ├── Ingresos mes/trimestre/año
│   ├── RevPAN (Revenue per Available Night)
│   ├── ADR (Average Daily Rate)
│   └── Proyección de ingresos anuales
├── Ocupación
│   ├── Tasa de ocupación por mes
│   ├── Mapa de calor de ocupación (calendario)
│   └── Lead time medio de reservas
├── Canales
│   ├── Reservas directas vs OTAs
│   ├── Comisiones pagadas a OTAs
│   └── Ahorro total gracias a la web directa
├── Huéspedes
│   ├── Distribución geográfica (mapa)
│   ├── Idioma más frecuente
│   └── Ratio de repetición
└── Valoraciones
    ├── Evolución de rating en el tiempo
    └── NPS (Net Promoter Score) estimado
```

**Exportación:** informes en PDF para declaraciones de impuestos (IAE, IVA, IRPF).

#### 26.3.8 Automatización de operaciones

**Flujos automáticos:**

| Trigger | Acción automática |
|---|---|
| 7 días antes del check-in | Email con instrucciones de llegada y link pre-check-in |
| 1 día antes del check-in | Código de la caja de llaves por SMS y email |
| Día del check-in (16:00) | WhatsApp de bienvenida al huésped |
| Día del check-out (09:00) | Recordatorio de horario de salida |
| 3 días después del check-out | Solicitud de reseña por email |
| 10 días sin reseña | Segundo recordatorio de reseña |
| Fin de mes | Resumen de ingresos por email al propietario |

**Stack:** Supabase Edge Functions + cron jobs, o servicio externo como Zapier/Make.

#### 26.3.9 Marketplace de experiencias locales

Ofrecer actividades curadas de Sevilla como upsells adicionales:

```
Experiencias en Sevilla
├── 🎭 Espectáculo flamenco (2 pax) — €85
├── 🍷 Tour de tapas y vinos (4 pax) — €120
├── 🚲 Ruta en bici por el río — €40/pax
├── 🏄 Paddle surf en el Guadalquivir — €35/pax
└── 👨‍🍳 Clase de cocina sevillana — €65/pax
```

**Modelo:** comisión del 15–20% por venta (afiliación con proveedores locales).
**Integración:** GetYourGuide API o Airbnb Experiences API para inventario en tiempo real.

#### 26.3.10 App para el personal de limpieza

Aplicación simplificada para el equipo de mantenimiento:

```
Esencia Sevilla — Staff App
├── Calendario de limpiezas
│   ├── Próximos check-outs que requieren limpieza
│   └── Confirmación de limpieza completada
├── Checklist de limpieza
│   ├── Habitaciones (fotos de confirmación)
│   ├── Baño
│   ├── Cocina
│   └── Zonas comunes
├── Reportar incidencia
│   ├── Foto del problema
│   └── Nivel de urgencia
└── Inventario
    ├── Stock de productos de limpieza
    └── Ropa de cama y toallas
```

---

### 26.4 Mejoras técnicas transversales

#### 26.4.1 Migración a Supabase Auth

Sustituir la autenticación con cookie simple del panel admin por Supabase Auth:
- JWT tokens con refresh automático
- Múltiples usuarios con roles (admin, staff)
- 2FA/MFA para el propietario
- Magic Links para acceso sin contraseña

#### 26.4.2 Internacionalización extendida

| Idioma | Justificación | Prioridad |
|---|---|---|
| Japonés (ja) | Turismo japonés creciente en Sevilla | Alta |
| Chino simplificado (zh) | Mayor mercado turístico mundial | Alta |
| Árabe (ar) | Turismo del Golfo Pérsico | Media |
| Ruso (ru) | Turistas de Europa del Este | Media |
| Holandés (nl) | Frecuente en turismo español | Media |

También: detección automática de idioma por GeoIP (no solo Accept-Language).

#### 26.4.3 Accesibilidad (WCAG 2.2 AA)

Auditoría completa y correcciones:
- Todos los controles del teclado (Tab, Enter, Space, Escape)
- Skip-to-content links
- ARIA labels en elementos sin texto visible
- Color contrast ratio ≥ 4.5:1 en todos los textos
- Alt text en todas las imágenes
- Reducción de movimiento (prefers-reduced-motion)

#### 26.4.4 Internacionalización del motor de precios

Actualmente los precios se calculan en EUR. Para el mercado internacional:
- Mostrar precios en la moneda del usuario (GBP, USD, CHF) usando tasas de cambio en tiempo real
- El cobro siempre en EUR (Stripe gestiona la conversión)
- API: Open Exchange Rates o Fixer.io

#### 26.4.5 Observabilidad y monitorización

**Error tracking:** integrar Sentry para capturar y alertar sobre errores en producción:
```typescript
// sentry.server.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  integrations: [Sentry.prismaIntegration()],
});
```

**Uptime monitoring:** BetterUptime o UptimeRobot con alertas por email/SMS.

**Logs estructurados:** Pino logger en todas las API routes → Logtail o Datadog.

**Health check endpoint:**
```typescript
// /api/health
{
  "status": "ok",
  "version": "1.0.0",
  "database": "connected",
  "stripe": "connected",
  "uptime": 3600
}
```

#### 26.4.6 CDN para imágenes

Migrar fotos a un CDN optimizado:
- **Cloudinary:** transformaciones automáticas (resize, formato, calidad)
- **ImageKit:** precios competitivos, región EU disponible
- **Vercel Image Optimization:** si se despliega en Vercel (ya incluido)

Beneficios: AVIF/WebP automático, lazy loading, LQIP (Low Quality Image Placeholders).

#### 26.4.7 Edge Runtime para disponibilidad

Migrar `/api/availability` a Edge Runtime para latencia < 50ms:
```typescript
export const runtime = 'edge';  // en route.ts
```

Supabase Edge Functions para la sincronización iCal (se ejecutan en el servidor de Supabase, cerca de la BD).

---

### 26.5 Estrategia de marketing digital

#### 26.5.1 SEO de contenidos

**Blog de Sevilla** (mínimo 2 artículos/semana):
- "Los 10 mejores flamencos shows en Sevilla" — keyword: "flamenco sevilla"
- "Guía completa de la Feria de Abril 2027" — keyword: "feria de abril"
- "Qué comer en Sevilla: las mejores tapas" — keyword: "tapas sevilla"
- "Barrio de Santa Cruz: cómo visitarlo" — keyword: "santa cruz sevilla"

**Estrategia de keywords:**
- Primario: "apartamento centro sevilla"
- Long tail: "apartamento con vistas catedral sevilla"
- Informacional: "que ver en sevilla en 3 dias"

#### 26.5.2 Google Ads

Campaña de búsqueda con keywords:
- `apartamento turístico sevilla`
- `alquiler vacacional sevilla centro`
- `pisos turísticos sevilla`

Landing page dedicada con A/B testing del precio y los CTAs.

#### 26.5.3 Meta Ads (Instagram/Facebook)

Audiencias:
- Intereses: viajes, Sevilla, España, cultura, gastronomía
- Lookalike de huéspedes que ya reservaron
- Retargeting a visitantes de la web que no convirtieron

Creatividades: vídeo del apartamento con subtítulos en varios idiomas.

---

*Documentación técnica completa de Esencia Sevilla v1.0.0 — Abril 2026*

---

> **Mantenimiento de este documento:** actualizar en cada release. Las secciones de Trabajo Futuro deben migrarse a la sección correspondiente una vez implementadas.
