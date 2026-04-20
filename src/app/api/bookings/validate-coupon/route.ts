import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ valid: false });

  const { data: coupon } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('active', true)
    .single();

  if (!coupon) return NextResponse.json({ valid: false });

  const now = new Date();
  if (coupon.valid_from && new Date(coupon.valid_from) > now) return NextResponse.json({ valid: false });
  if (coupon.valid_until && new Date(coupon.valid_until) < now) return NextResponse.json({ valid: false });
  if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) return NextResponse.json({ valid: false });

  return NextResponse.json({
    valid: true,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    discountAmount: coupon.discount_type === 'fixed' ? coupon.discount_value : null,
  });
}
