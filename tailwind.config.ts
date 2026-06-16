import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        institutional: {
          ink: '#071527',
          muted: '#5d6b7c',
          line: '#d9e2ef',
          paper: '#ffffff',
          soft: '#f7faff',
          blue: '#1057d8',
          cobalt: '#073f9f',
          pale: '#eaf2ff'
        },
        midnight: {
          50: '#f7faff',
          100: '#eaf2ff',
          200: '#cbdcff',
          300: '#9db9ff',
          400: '#6c93ff',
          500: '#2b73ff',
          600: '#1057d8',
          700: '#073f9f',
          800: '#082f74',
          900: '#071f4d',
          950: '#071527'
        },
        cyanlux: '#1057d8',
        goldlux: '#1057d8',
        panel: '#ffffff',
        panelSoft: '#f7faff'
      },
      boxShadow: {
        executive: '0 18px 55px rgba(7, 21, 39, 0.08)',
        institutional: '0 26px 80px rgba(16, 87, 216, 0.14)',
        card: '0 18px 55px rgba(7, 21, 39, 0.08)',
        cobalt: '0 18px 44px rgba(16, 87, 216, 0.22)',
        'blue-soft': '0 18px 44px rgba(16, 87, 216, 0.18)',
        'blue-glow': '0 26px 80px rgba(16, 87, 216, 0.14)',
        glow: '0 26px 80px rgba(16, 87, 216, 0.14)'
      },
      backgroundImage: {
        'deep-radial': 'radial-gradient(circle at 14% 0%, rgba(16,87,216,.10), transparent 30rem), radial-gradient(circle at 92% 10%, rgba(43,115,255,.08), transparent 32rem), linear-gradient(180deg, #ffffff 0%, #f7faff 48%, #ffffff 100%)',
        'glass-line': 'linear-gradient(135deg, rgba(255,255,255,.98), rgba(247,250,255,.86))'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(0, -14px, 0) rotate(1.4deg)' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '.52', transform: 'scale(1)' },
          '50%': { opacity: '.92', transform: 'scale(1.025)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-12deg)' },
          '100%': { transform: 'translateX(220%) skewX(-12deg)' }
        }
      },
      animation: {
        float: 'float 7.6s ease-in-out infinite',
        orbit: 'orbit 34s linear infinite',
        pulseGlow: 'pulseGlow 4.8s ease-in-out infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
