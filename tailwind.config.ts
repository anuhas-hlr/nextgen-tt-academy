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
        navy: {
          DEFAULT: '#101B35',
          50:  '#E8EBF2',
          100: '#C5CEDE',
          200: '#8E9FC0',
          300: '#5A70A1',
          400: '#2E4882',
          500: '#101B35',
          600: '#0D1729',
          700: '#09111F',
          800: '#060C15',
          900: '#03060A',
        },
        electric: {
          DEFAULT: '#2675F5',
          50:  '#EBF1FE',
          100: '#C3D7FD',
          200: '#8DB4FB',
          300: '#5890F9',
          400: '#3A80F7',
          500: '#2675F5',
          600: '#1358CC',
          700: '#0D3E96',
          800: '#082869',
          900: '#04143B',
        },
        lgrey: {
          DEFAULT: '#F5F7FB',
          50:  '#FFFFFF',
          100: '#F5F7FB',
          200: '#E8EDF5',
          300: '#D2DAEB',
          400: '#B8C4D8',
          500: '#9AAAC4',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #101B35 0%, #1a2d5a 50%, #0d1729 100%)',
        'gradient-hero': 'linear-gradient(135deg, #101B35 0%, #0d1f4a 60%, #152040 100%)',
        'gradient-electric': 'linear-gradient(135deg, #2675F5 0%, #1358CC 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'electric': '0 0 20px rgba(38, 117, 245, 0.4)',
        'navy-sm': '0 2px 8px rgba(16, 27, 53, 0.12)',
        'navy-md': '0 4px 24px rgba(16, 27, 53, 0.16)',
        'navy-lg': '0 8px 48px rgba(16, 27, 53, 0.24)',
        'card': '0 1px 4px rgba(16,27,53,0.08), 0 8px 32px rgba(16,27,53,0.10)',
        'card-hover': '0 4px 16px rgba(16,27,53,0.12), 0 24px 48px rgba(16,27,53,0.16)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
