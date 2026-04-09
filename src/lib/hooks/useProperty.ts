'use client';

import { useState, useEffect } from 'react';
import type { Property } from '@/types/property';
import { getProperty } from '@/lib/firebase/firestore';

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getProperty(id)
      .then((p) => {
        setProperty(p);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { property, loading, error };
}
