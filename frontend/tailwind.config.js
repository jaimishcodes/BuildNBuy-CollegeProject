/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
        },
        secondary: '#3B82F6',
        accent: '#F59E0B',
        surface: '#FFFFFF',
        section: '#F8FAFC',
        ink: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(15, 23, 42, 0.08)',
        cardHover: '0 12px 32px -6px rgba(37, 99, 235, 0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
