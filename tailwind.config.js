const BRAND_COLORS = {
  loser: '#ef4444',
  winner: '#f59e0b',
  krilion: '#10b981',
  metazooa: '#f97316',
  chronophoto: '#8b5cf6',
  totale: '#3b82f6',
  space: '#0a0b14',
  surface: '#121526',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px', // Telefoni in landscape e tablet verticali
      md: '768px', // Tablet verticali e piccoli laptop
      lg: '1024px', // Laptop standard
      xl: '1280px', // Desktop larghi
      '2xl': '1536px', // Schermi ultra-wide
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Synthwave / Cyberpunk Brand Tokens
        loser: BRAND_COLORS.loser,
        winner: BRAND_COLORS.winner,
        surface: BRAND_COLORS.surface,
        space: BRAND_COLORS.space,
        game: {
          krilion: BRAND_COLORS.krilion,
          metazooa: BRAND_COLORS.metazooa,
          chronophoto: BRAND_COLORS.chronophoto,
          totale: BRAND_COLORS.totale,
        },
      },
      boxShadow: {
        'glow-loser': '0 0 25px rgba(239, 68, 68, 0.4)',
        'glow-winner': '0 0 25px rgba(245, 158, 11, 0.4)',
        'glow-krilion': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-metazooa': '0 0 20px rgba(249, 115, 22, 0.35)',
        'glow-chronophoto': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backgroundColor: {
        color: 'black',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        merriweather: ['var(--font-merriweather)', 'system-ui', 'serif'],
        opensans: ['var(--font-opensans)', 'system-ui'],
        poppins: ['var(--font-poppins)', 'system-ui'],
        lato: ['var(--font-lato)', 'system-ui'],
        nunito: ['var(--font-nunito)', 'system-ui'],
        raleway: ['var(--font-raleway)', 'system-ui'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
