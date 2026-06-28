import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sights')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ sights: data || [] });
  } catch (e) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
