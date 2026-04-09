'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthChange } from '@/lib/firebase/auth';
import { isAdminUser } from '@/lib/firebase/firestore';

export function useAdminGuard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (u) => {
      if (!u) {
        router.replace('/admin/login');
        setLoading(false);
        return;
      }
      const isAdmin = await isAdminUser(u.uid);
      if (!isAdmin) {
        const { signOut } = await import('@/lib/firebase/auth');
        await signOut();
        router.replace('/admin/login');
        setLoading(false);
        return;
      }
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, [router]);

  return { user, loading };
}
