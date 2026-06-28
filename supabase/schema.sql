-- ============================================
-- ESENCIA SEVILLA — Schema completo de Supabase
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- Tabla: bookings (reservas)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  guest_name TEXT,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  guest_passport_type TEXT,
  guest_passport_number TEXT,
  guest_nationality TEXT,
  guest_birthdate DATE,
  estimated_arrival_time TEXT,
  special_needs TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  upsells JSONB DEFAULT '[]',
  coupon_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  source TEXT DEFAULT 'direct',
  precheckin_completed BOOLEAN DEFAULT false,
  precheckin_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla: reviews (reseñas nativas)
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

-- Tabla: blocked_dates (fechas bloqueadas)
CREATE TABLE IF NOT EXISTS blocked_dates (
  date DATE PRIMARY KEY,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla: settings (configuración dinámica)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla: sights (puntos de interés / POIs)
CREATE TABLE IF NOT EXISTS sights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('monument', 'neighborhood', 'culture', 'food', 'nature', 'modern', 'fun')),
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  walk_minutes INTEGER,
  entrance TEXT,
  url TEXT,
  image TEXT,
  description JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla: routes (rutas turísticas a pie)
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('classic', 'neighborhoods', 'romantic', 'food', 'family', 'culture', 'nature', 'shopping', 'photos')),
  duration TEXT,
  distance TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  image TEXT,
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  stops JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sights ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY IF NOT EXISTS "reviews_read_approved" ON reviews
  FOR SELECT USING (approved = true);
CREATE POLICY IF NOT EXISTS "blocked_dates_read" ON blocked_dates
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "sights_read" ON sights
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "routes_read" ON routes
  FOR SELECT USING (true);

-- Nota: las operaciones de escritura se hacen con service_role_key (server-side)
-- No se crean políticas de escritura pública por seguridad