import { type Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'grid-glow': "linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0) 40%), linear-gradient(225deg, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0) 40%)"
      },
      boxShadow: {
        glass: '0 20px 80px -32px rgba(56,189,248,0.45)'
      }
    }
  },
  plugins: [animate, typography]
} satisfies Config;
