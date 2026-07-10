/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#18181b',
        border: '#27272a',
        primary: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
        },
        secondary: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
        },
        success: {
          DEFAULT: '#10b981',
          hover: '#059669',
        },
        muted: '#71717a',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
