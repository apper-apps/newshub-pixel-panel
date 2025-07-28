/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        secondary: '#1A1A1A',
        accent: '#0066CC',
        surface: '#FFFFFF',
        background: '#F5F5F5',
        success: '#00A652',
        warning: '#FFA500',
        error: '#DC3545',
        info: '#17A2B8'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-live': 'pulse 2s infinite',
        'shimmer': 'shimmer 2s linear infinite'    
      },
      keyframes: {
        shimmer: {
          '0%': {
            'background-position': '-200px 0'
          },
          '100%': {
            'background-position': 'calc(200px + 100%) 0'
          }
        }
      }
    },
  },
  plugins: [],
}