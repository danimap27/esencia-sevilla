'use client';

import { useState, useEffect } from 'react';
import { Sight, TouristRoute } from '@/types';

export function useSights() {
  const [sights, setSights] = useState<Sight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sights')
      .then(res => res.json())
      .then(data => {
        setSights(data.sights || []);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load sights');
        setLoading(false);
      });
  }, []);

  return { sights, loading, error };
}

export function useRoutes() {
  const [routes, setRoutes] = useState<TouristRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => {
        setRoutes(data.routes || []);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load routes');
        setLoading(false);
      });
  }, []);

  return { routes, loading, error };
}