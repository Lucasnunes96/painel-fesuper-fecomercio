/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fecomercio: {
          navy: '#002B55',
          blue: '#004B8D',
          hover: '#003B72',
          gold: '#C97A00',
          amber: '#D97706',
          light: '#EBF4FC',
        },
        fesuper: {
          darkGreen: '#033B2E',
          green: '#065F46',
          emerald: '#059669',
          lightGreen: '#E6F7F0',
          orange: '#D9531E',
          coral: '#EA580C',
        },
        nps: {
          promoter: '#059669',
          passive: '#D97706',
          detractor: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

