'use client';

import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherData {
  current: {
    temperature: number;
    icon: string;
    description: string;
    windSpeed: number;
    humidity: number;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    icon: string;
    precipitation: number;
  }>;
}

export default function WeatherWidget({ compact = false }: { compact?: boolean }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        if (data.current) setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={cn('rounded-2xl bg-white/50 border border-tinta/10 p-5', compact && 'p-3')}>
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-tinta/10" />
          <div className="space-y-2">
            <div className="h-4 w-20 bg-tinta/10 rounded" />
            <div className="h-3 w-16 bg-tinta/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className={cn(
      'rounded-2xl bg-gradient-to-br from-azulejo-50 to-white border border-azulejo-100 overflow-hidden',
      compact ? 'p-4' : 'p-6'
    )}>
      {/* Current weather */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{weather.current.icon}</span>
          <div>
            <p className="text-2xl font-serif font-bold text-tinta">{weather.current.temperature}°C</p>
            <p className="text-sm text-tinta/60">{weather.current.description}</p>
          </div>
        </div>
        {!compact && (
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-tinta/60">
              <Wind size={12} /> {weather.current.windSpeed} km/h
            </div>
            <div className="flex items-center gap-1.5 text-xs text-tinta/60">
              <Droplets size={12} /> {weather.current.humidity}%
            </div>
          </div>
        )}
      </div>

      {/* 7-day forecast */}
      {!compact && weather.forecast.length > 0 && (
        <div className="grid grid-cols-7 gap-1">
          {weather.forecast.slice(0, 7).map((day, i) => {
            const date = new Date(day.date);
            const dayName = i === 0 ? 'Hoy' : days[date.getDay()];
            return (
              <div key={i} className="text-center py-2">
                <p className="text-[10px] text-tinta/50 font-medium uppercase">{dayName}</p>
                <p className="text-xl my-1">{day.icon}</p>
                <p className="text-xs font-semibold text-tinta">{day.maxTemp}°</p>
                <p className="text-[10px] text-tinta/40">{day.minTemp}°</p>
                {day.precipitation > 20 && (
                  <p className="text-[9px] text-azulejo-500 flex items-center justify-center gap-0.5 mt-0.5">
                    <Droplets size={7} />{day.precipitation}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}