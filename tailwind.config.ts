import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040814',
          900: '#070E20',
          800: '#0C1631',
          700: '#132247',
        },
        cyan: {
          glow: '#00F0FF',
          electric: '#38BDF8',
        },
        neural: {
          violet: '#8B5CF6',
          magenta: '#EC4899',
        },
        amber: {
          warm: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-space)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'radial-city': 'radial-gradient(circle at 50% 45%, rgba(14, 30, 68, 0.55) 0%, rgba(4, 8, 20, 0.98) 75%)',
        'radial-city-day': 'radial-gradient(circle at 50% 45%, rgba(224, 242, 254, 0.85) 0%, rgba(203, 213, 225, 0.98) 80%)',
      },
    },
  },
  plugins: [],
};

export default config;
