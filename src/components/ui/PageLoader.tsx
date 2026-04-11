import { LogoMark } from '@/components/ui/Logo';

/**
 * Full-page centred loader shown via Next.js loading.tsx files.
 * Displays the hawk mark inside a slow-spinning ring with a soaring float animation.
 */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full animate-loader-in">
      <div className="flex flex-col items-center gap-6">

        {/* Hawk mark inside spinning ring */}
        <div className="relative flex items-center justify-center w-24 h-24">

          {/* Spinning arc ring (SVG — arc rotates around track) */}
          <svg
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full animate-spin-slow"
            aria-hidden="true"
          >
            {/* Full track (faint) */}
            <circle
              cx="48" cy="48" r="44"
              stroke="#E0DDD6"
              strokeWidth="2"
            />
            {/* Moving arc segment */}
            <circle
              cx="48" cy="48" r="44"
              stroke="#111111"
              strokeWidth="2.5"
              strokeDasharray="69 208"
              strokeLinecap="round"
            />
          </svg>

          {/* Hawk icon — soars (floats up/down) */}
          <LogoMark className="relative z-10 w-10 h-11 text-ink animate-hawk-soar" />
        </div>

        {/* Brand text */}
        <div className="text-center">
          <p className="font-bold text-ink text-base tracking-tight">Sky Hawk</p>
          <p className="text-ink-400 text-xs mt-0.5 tracking-wider uppercase">Property Dealer</p>
        </div>

        {/* Pulsing dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-ink-200"
              style={{ animation: `hawkSoar 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
