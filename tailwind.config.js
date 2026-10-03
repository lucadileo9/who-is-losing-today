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
      sm: '640px',  // Telefoni in landscape e tablet verticali
      md: '768px',  // Tablet verticali e piccoli laptop
      lg: '1024px', // Laptop standard
      xl: '1280px', // Desktop larghi
      '2xl': '1536px', // Schermi ultra-wide
    },
    container: {
      center: true, // Centra automaticamente il contenitore
      padding: {
        center: true,
        padding: {
          DEFAULT: '0.5rem', // Padding predefinito
          sm: '0.5rem',      // Padding per schermi piccoli
          md: '1rem',        // Padding per tablet
          lg: '2rem',        // Padding per laptop
          xl: '3rem',        // Padding per desktop
          '2xl': '4rem',     // Padding per schermi ultra-wide
        },
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
