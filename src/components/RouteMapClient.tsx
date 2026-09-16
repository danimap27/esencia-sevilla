'use client';

import dynamic from 'next/dynamic';

const RouteMap = dynamic(() => import('@/components/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-2xl bg-crema-dark flex items-center justify-center text-tinta/40 text-sm">
      Cargando mapa…
    </div>
  ),
});

export default RouteMap;
