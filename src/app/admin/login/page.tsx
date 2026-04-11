'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/firebase/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { Logo } from '@/components/ui/Logo';

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showPw, setShowPw]  = useState(false);
  const [submitting, setSub] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!loading && user) router.replace('/admin');
  }, [user, loading, router]);

  async function onSubmit(data: FormValues) {
    setSub(true);
    try {
      await signIn(data.email, data.password);
      router.replace('/admin');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setSub(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-10">
          <Logo variant="dark" size="md" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-ink mb-1">Admin Login</h1>
        <p className="text-ink-500 text-sm mb-8">Sign in to manage your property listings.</p>

        {/* Form */}
        <div className="bg-white border border-warm-border rounded-2xl p-6 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                {...register('email')}
                className="input-base"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="input-base pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-ink text-white font-semibold text-sm hover:bg-ink-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {submitting ? <><Spinner size="sm" /> Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Setup hint */}
        <div className="mt-6 p-4 bg-white border border-warm-border rounded-xl">
          <p className="text-xs font-semibold text-ink mb-1.5">First time setup?</p>
          <p className="text-xs text-ink-500 leading-relaxed">
            Enable Firestore, Storage &amp; Auth in Firebase Console → create an Email/Password user → add their UID as a document in the <code className="bg-warm px-1 rounded text-ink">adminUsers</code> collection.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-ink-400 hover:text-ink transition-colors">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
