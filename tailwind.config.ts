import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dfeaff',
          500: '#1d4ed8',
          600: '#1e3a8a',
          700: '#132a5c',
          900: '#0b1120',
        },
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
      },
      boxShadow: {
        card: '0 12px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
