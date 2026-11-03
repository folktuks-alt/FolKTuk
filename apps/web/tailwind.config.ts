import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17221d',
        moss: '#2f6b4f',
        cream: '#f7f4ed',
        coral: '#dc7659',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(23, 34, 29, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
