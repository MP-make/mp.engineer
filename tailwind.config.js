/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        dark: 'var(--dark)',
        darker: 'var(--darker)',
        card: 'var(--card)',
        customWhite: 'var(--customWhite)',
        neonPurple: 'var(--neonPurple)',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}