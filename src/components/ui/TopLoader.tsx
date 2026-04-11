'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function TopLoader() {
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [visible,  setVisible]  = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clear() {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }

  useEffect(() => {
    // Route change detected — animate the bar to 100% then fade out
    clear();
    setVisible(true);
    setProgress(15);

    const t1 = setTimeout(() => setProgress(50),  120);
    const t2 = setTimeout(() => setProgress(80),  350);
    const t3 = setTimeout(() => setProgress(100), 600);
    const t4 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 950);

    timerRef.current = [t1, t2, t3, t4];
    return clear;
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-[2px]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}
    >
      <div
        className="h-full bg-ink"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? 'none' : 'width 300ms ease-out',
        }}
      />
    </div>
  );
}
