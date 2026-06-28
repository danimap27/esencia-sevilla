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

ALTER TABLE sights ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sights_read" ON sights FOR SELECT USING (true);
CREATE POLICY "routes_read" ON routes FOR SELECT USING (true);
