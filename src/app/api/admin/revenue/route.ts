import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth');
  if (authCookie?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all confirmed bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount, status, check_in')
      .eq('status', 'confirmed');

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthlyRevenue: Record<string, number> = {};
    (bookings || []).forEach((b: any) => {
      const date = new Date(b.check_in);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + b.total_amount;
    });

    const thisMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const lastMonthKey = `${lastMonthYear}-${String(lastMonth + 1).padStart(2, '0')}`;

    const thisMonthRevenue = monthlyRevenue[thisMonthKey] || 0;
    const lastMonthRevenue = monthlyRevenue[lastMonthKey] || 0;
    const growth = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // Last 6 months for chart
    const last6Months: Array<{ month: string; revenue: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      last6Months.push({
        month: d.toLocaleDateString('es-ES', { month: 'short' }),
        revenue: monthlyRevenue[key] || 0,
      });
    }

    return NextResponse.json({
      thisMonth: thisMonthRevenue,
      lastMonth: lastMonthRevenue,
      growth,
      chart: last6Months,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}