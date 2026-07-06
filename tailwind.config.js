/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        marina: {
          blue: '#1a1f5a',
          indigo: '#3b3f8f',
          red: '#ef233c',
          redLight: '#ff5346',
          green: '#22c55e',
          cyan: '#22d3ee',
          ink: '#0b0b12',
        },
      },
      backgroundImage: {
        'marina-hero': 'linear-gradient(135deg, #1a1f5a 0%, #4a2a7a 45%, #c22a4a 75%, #ef233c 100%)',
        'marina-contact': 'linear-gradient(120deg, #1a1f5a 0%, #7a2a5a 55%, #ef233c 100%)',
      },
      boxShadow: {
        pop: '0 20px 50px -12px rgba(15, 19, 56, 0.35)',
      },
    },
  },
  plugins: [],
}
