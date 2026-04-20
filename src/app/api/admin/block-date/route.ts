import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional().default('Manual block'),
});

export async function POST(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth');
  if (authCookie?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { date, reason } = schema.parse(body);

  const { error } = await supabaseAdmin
    .from('blocked_dates')
    .upsert({ date, reason, source: 'manual' }, { onConflict: 'date' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth');
  if (authCookie?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { date } = await req.json();

  const { error } = await supabaseAdmin
    .from('blocked_dates')
    .delete()
    .eq('date', date)
    .eq('source', 'manual');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
