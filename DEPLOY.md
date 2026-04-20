# Guía de Despliegue — Esencia Sevilla

## 1. Instalación local

```bash
cd esencia-sevilla
npm install
cp .env.example .env.local
# → Rellena todas las variables de entorno en .env.local
npm run dev
# → Abre http://localhost:3000/es
```

## 2. Variables de entorno obligatorias

### Mínimo para desarrollo:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENROUTER_API_KEY=sk-or-v1-...
```

### Para producción (añadir):
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
ADMIN_PASSWORD=contraseña_segura_aqui
```

## 3. Configurar Supabase

1. Crea un proyecto en https://supabase.com
2. Ve a "SQL Editor" y ejecuta el schema de `src/lib/supabase.ts` (comentado al final del archivo)
3. Copia las claves al `.env.local`

## 4. Configurar Stripe

1. Crea cuenta en https://stripe.com
2. Activa los métodos: Tarjeta + Apple Pay + Google Pay
3. Configura webhook apuntando a: `https://tudominio.com/api/webhooks/stripe`
4. Eventos a escuchar: `checkout.session.completed`, `checkout.session.expired`

## 5. Despliegue en Vercel (recomendado)

```bash
# Instala Vercel CLI
npm i -g vercel

# Despliega
vercel --prod

# O con GitHub: conecta el repo desde https://vercel.com/new
```

### Configuración en Vercel:
- Framework: Next.js (autodetectado)
- Build command: `npm run build`
- Root directory: `esencia-sevilla`
- Variables de entorno: añade todas las de `.env.local`

## 6. Sincronización iCal (Booking.com + Airbnb)

### Booking.com:
1. Panel → Propiedades → Calendario → Sincronización
2. Copia la URL iCal
3. Añade a `ICAL_BOOKING_URL` en el `.env`

### Airbnb:
1. Gestiona → Disponibilidad → Exportar calendario
2. Copia la URL iCal
3. Añade a `ICAL_AIRBNB_URL` en el `.env`

## 7. Webhook de Stripe en local (desarrollo)

```bash
# Instala Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 8. Fotos del apartamento

Copia las fotos existentes a `public/fotos/`:
- foto1.jpg ... foto12.jpg (mínimo 10 fotos)
- Tamaño recomendado: 1200x800px, formato WebP
- Crea también `public/og-image.jpg` (1200x630px) para redes sociales

## 9. Checklist SEO post-despliegue

- [ ] Google Search Console: verificar propiedad y enviar sitemap
- [ ] Bing Webmaster Tools: verificar propiedad
- [ ] Google Analytics 4: verificar que los eventos llegan
- [ ] Meta Pixel: verificar en Facebook Ads Manager
- [ ] Google Business Profile: vincular web y mantener ficha actualizada
- [ ] Test Core Web Vitals: https://pagespeed.web.dev
- [ ] Test Schema: https://search.google.com/test/rich-results
- [ ] Test hreflang: https://www.hreflang.org/checker/

## 10. Checklist legal (RGPD + turístico)

- [ ] Nº registro turístico Junta de Andalucía visible en footer y hero
- [ ] Banner de cookies RGPD implementado
- [ ] Política de Privacidad publicada
- [ ] Términos y Condiciones publicados
- [ ] Pre-check-in online recoge datos para SES.HOSPEDERÍA
- [ ] Datos cifrados en Supabase (activar en dashboard)

## 11. Actualización de contenidos

### Cambiar precios:
→ `src/data/apartment.ts` → `basePricePerNight`

### Añadir fotos:
→ Copia a `public/fotos/` + actualiza array en `src/components/Gallery.tsx`

### Actualizar FAQ:
→ `messages/es.json` → sección `faq.questions`

### Cambiar system prompt del chatbot:
→ `src/app/api/chat/route.ts` → constante `SYSTEM_PROMPT`

### Añadir artículo al blog:
→ `src/data/blog-posts.ts` → añadir objeto BlogPost

## 12. Estructura del proyecto

```
esencia-sevilla/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Páginas públicas (home, guia, admin, blog...)
│   │   ├── api/               # API routes (chat, bookings, webhooks...)
│   │   ├── layout.tsx         # Root layout (fonts, globals)
│   │   ├── sitemap.ts         # Sitemap XML dinámico
│   │   └── robots.ts          # robots.txt
│   ├── components/            # Componentes React
│   ├── data/                  # Datos estáticos (apartamento, puntos interés...)
│   ├── lib/                   # Utilidades (Supabase, Stripe, utils)
│   ├── types/                 # TypeScript types
│   └── i18n.ts                # Config i18n
├── messages/                  # Traducciones (es, en, fr, de, it, pt)
├── public/                    # Assets estáticos (fotos, icons, manifest)
├── middleware.ts              # Routing i18n
└── .env.example              # Template variables de entorno
```
