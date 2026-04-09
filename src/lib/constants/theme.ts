export const COLORS = {
  gold: {
    300: '#F0D060',
    400: '#D4AF37',
    500: '#B8960C',
    600: '#9A7A00',
  },
  navy: {
    800: '#1E3A5F',
    900: '#0F1E33',
    950: '#080F1A',
  },
  forest: {
    600: '#2D6A4F',
    700: '#1B4332',
  },
} as const;

export const GLASS_STYLES = {
  card: 'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl',
  input: 'bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30',
  nav: 'bg-black/60 backdrop-blur-lg border-b border-white/10',
} as const;
