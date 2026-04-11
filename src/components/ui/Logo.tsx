import { clsx } from 'clsx';

/** Geometric hawk mark — body + wings + head, renders via currentColor */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 44"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Head */}
      <circle cx="20" cy="6" r="4.5" />
      {/* Body — tapered teardrop from shoulders to tail tip */}
      <path d="M16 12C14 16 13 28 20 42C27 28 26 16 24 12C22 10 18 10 16 12Z" />
      {/* Left wing — curved sweep */}
      <path d="M15 18C9 14 1 18 0 23C5 23 11 22 15 22Z" />
      {/* Right wing — mirrored */}
      <path d="M25 18C31 14 39 18 40 23C35 23 29 22 25 22Z" />
    </svg>
  );
}

interface LogoProps {
  /** 'dark' = ink mark + ink text (navbar). 'light' = white mark + white text (footer). */
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Full brand wordmark: hawk icon + "Sky Hawk / Property Dealer" */
export function Logo({ variant = 'dark', size = 'md', className }: LogoProps) {
  const markColor  = variant === 'light' ? 'text-white'      : 'text-ink';
  const textColor  = variant === 'light' ? 'text-white'      : 'text-ink';
  const subColor   = variant === 'light' ? 'text-white/40'   : 'text-ink-400';

  const markSize  = { sm: 'w-6 h-[27px]', md: 'w-8 h-9', lg: 'w-11 h-12'  }[size];
  const mainText  = { sm: 'text-[13px]',  md: 'text-[15px]', lg: 'text-lg'  }[size];
  const subText   = { sm: 'text-[10px]',  md: 'text-[11px]', lg: 'text-xs'  }[size];

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      {/* <LogoMark className={clsx(markSize, markColor, 'shrink-0')} /> */}
      <img alt="" src="/assets/skyhawkpropertydealerlogo.png" width={110} height={110}/>
      {/* <span className={clsx('font-bold tracking-tight leading-none', textColor, mainText)}>
        Sky Hawk
        <br />
        <span className={clsx('font-medium tracking-wide', subColor, subText)}>
          Property Dealer
        </span>
      </span> */}
    </div>
  );
}
