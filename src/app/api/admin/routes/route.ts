import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/routes — listar todas las rutas
export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth');
  if (authCookie?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ routes: data || [] });
  } catch (e) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST /api/admin/routes — crear nueva ruta
export async function POST(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth');
  if (authCookie?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('routes')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ route: data });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
}

// PUT /api/admin/routes — actualizar ruta
export async function PUT(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth');
  if (authCookie?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    const { data, error } = await supabase
      .from('routes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ route: data });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}

// DELETE /api/admin/routes — eliminar ruta
export async function DELETE(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth');
  if (authCookie?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
}