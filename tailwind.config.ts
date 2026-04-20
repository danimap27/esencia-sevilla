import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracota: {
          50:  '#fdf3ef',
          100: '#fae4db',
          200: '#f5c9b7',
          300: '#eda58a',
          400: '#e47659',
          500: '#C25A3A',
          600: '#a84730',
          700: '#8d3927',
          800: '#742f22',
          900: '#5f271e',
          DEFAULT: '#C25A3A',
          light: '#D97B5E',
          dark: '#9E4830',
        },
        azulejo: {
          50:  '#eff5fb',
          100: '#d9e8f5',
          200: '#b4d2ec',
          300: '#7eb3de',
          400: '#4a8fcc',
          500: '#2A5A8C',
          600: '#1f4872',
          700: '#1a3a5c',
          800: '#182f4b',
          900: '#17283f',
          DEFAULT: '#2A5A8C',
          light: '#3D78B5',
          dark: '#1E4066',
        },
        ocre: {
          50:  '#fdf8ef',
          100: '#faedd5',
          200: '#f5d9ab',
          300: '#eebe76',
          400: '#e5a24a',
          500: '#D9A760',
          600: '#c08730',
          700: '#9f6b27',
          800: '#805625',
          900: '#6b4623',
          DEFAULT: '#D9A760',
          light: '#E8C287',
          dark: '#B8873E',
        },
        crema: {
          DEFAULT: '#F7F0E3',
          dark: '#EDE3D0',
          darker: '#E0D4BE',
        },
        tinta: {
          DEFAULT: '#2B1E15',
          light: '#4A3728',
          lighter: '#6B5444',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/pattern-azulejo.svg')",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(43, 30, 21, 0.08), 0 10px 20px -2px rgba(43, 30, 21, 0.04)',
        'medium': '0 4px 20px -4px rgba(43, 30, 21, 0.12), 0 12px 28px -4px rgba(43, 30, 21, 0.06)',
        'large': '0 8px 30px -6px rgba(43, 30, 21, 0.16), 0 20px 40px -6px rgba(43, 30, 21, 0.08)',
        'card': '0 1px 3px rgba(43, 30, 21, 0.06), 0 4px 16px rgba(43, 30, 21, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2B1E15',
            a: { color: '#C25A3A' },
            h1: { fontFamily: 'Cormorant Garamond, serif', color: '#2B1E15' },
            h2: { fontFamily: 'Cormorant Garamond, serif', color: '#2B1E15' },
            h3: { fontFamily: 'Cormorant Garamond, serif', color: '#2B1E15' },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
