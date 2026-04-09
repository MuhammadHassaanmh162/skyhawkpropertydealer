import { ToastProvider } from '@/components/ui/Toast';

// Minimal shell — light theme consistent with main site.
// Auth guard lives in app/admin/(protected)/layout.tsx (doesn't cover /admin/login).
export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-50 text-ink">
      {children}
      <ToastProvider />
    </div>
  );
}
