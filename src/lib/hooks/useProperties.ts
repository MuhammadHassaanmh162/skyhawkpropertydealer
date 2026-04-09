'use client';

import { useState, useEffect } from 'react';
import type { Property } from '@/types/property';
import { subscribeToProperties } from '@/lib/firebase/firestore';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToProperties((data) => {
      setProperties(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { properties, loading, error };
}
