/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#060913',
          900: '#0B1020',
          800: '#111827',
          700: '#1F2937',
        },
        brand: {
          blue: '#4F7CFF',
          'blue-hover': '#3D68E6',
          violet: '#8B5CF6',
          'violet-hover': '#7C3AED',
          surface: '#F7F8FC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
