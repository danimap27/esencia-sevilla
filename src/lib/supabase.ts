import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase (uses anon key, subject to RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase admin (bypasses RLS — use only in API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// =============================================
// SUPABASE SCHEMA (run in Supabase SQL editor)
// =============================================
/*
-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  payment_intent_id TEXT,
  upsells JSONB DEFAULT '[]',
  coupon_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  source TEXT DEFAULT 'direct',
  locale TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  pre_checkin_completed BOOLEAN DEFAULT FALSE,
  pre_checkin_data JSONB
);

-- Blocked dates table (manual blocks + synced from external calendars)
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  reason TEXT,
  source TEXT DEFAULT 'manual',
  booking_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX blocked_dates_date_idx ON blocked_dates(date);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  country TEXT,
  country_flag TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_date DATE NOT NULL,
  source TEXT DEFAULT 'direct',
  text_es TEXT,
  text_en TEXT,
  text_fr TEXT,
  text_de TEXT,
  text_it TEXT,
  text_pt TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  valid_from DATE,
  valid_until DATE,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews only
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (approved = true);

-- Public can read non-blocked dates (availability)
CREATE POLICY "Public read blocked dates" ON blocked_dates FOR SELECT USING (true);

-- Public can insert bookings
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Public can read their own booking by email
CREATE POLICY "Guest read own booking" ON bookings FOR SELECT USING (true);
*/
