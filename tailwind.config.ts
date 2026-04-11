import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs:  '480px',
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Primary text / button color
        ink: {
          DEFAULT: '#111111',
          900: '#111111',
          800: '#1F1F1F',
          700: '#333333',
          600: '#4A4A4A',
          500: '#666666',
          400: '#888888',
          300: '#AAAAAA',
          200: '#CCCCCC',
          100: '#E5E2DC',
          50:  '#F0EDE6',
        },
        // Warm off-white surfaces
        warm: {
          DEFAULT: '#F5F3EE',
          50:  '#FAFAF7',
          100: '#F5F3EE',
          200: '#EAE7E0',
          300: '#DDD9D1',
          border: '#E0DDD6',
        },
        // WhatsApp green only
        wa: {
          DEFAULT: '#25D366',
          600: '#1DAE57',
        },
        // Kept for backwards compat in admin only
        gold: {
          400: '#D4AF37',
          500: '#B8960C',
          gradient: 'linear-gradient(135deg, #B8960C 0%, #D4AF37 100%)',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B8960C 0%, #D4AF37 40%, #F5C518 70%, #D4AF37 100%)',
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-lg':    '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
        'nav':        '0 1px 0 rgba(0,0,0,0.07)',
        'input':      '0 0 0 3px rgba(17,17,17,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'spin-slow':  'spin 2s linear infinite',
        'hawk-soar':  'hawkSoar 2.4s ease-in-out infinite',
        'loader-in':  'loaderIn 0.3s ease-out forwards',
        'loader-out': 'loaderOut 0.4s ease-in forwards',
      },
      keyframes: {
        fadeUp:    { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        hawkSoar:  { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-5px)' } },
        loaderIn:  { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        loaderOut: { '0%': { opacity: '1', transform: 'scale(1)' }, '100%': { opacity: '0', transform: 'scale(0.95)' } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
