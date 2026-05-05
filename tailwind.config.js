/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#112533',
        mist: '#edf6f6',
        line: '#d6e5e7',
        accent: '#0f9c8f',
        accentDeep: '#0a6f66',
        sky: '#e7f0ff',
        warm: '#f5efe8'
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Segoe UI"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 40px rgba(17, 37, 51, 0.08)',
        card: '0 12px 32px rgba(15, 37, 51, 0.12)'
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(17, 37, 51, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 37, 51, 0.05) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
