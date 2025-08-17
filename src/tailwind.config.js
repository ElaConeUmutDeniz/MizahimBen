// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This is the key change!
        // We're telling the 'sans' font utility to use our CSS variable.
        // We also provide fallback fonts in case the variable isn't set.
        sans: ['var(--font-family)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // You can keep other extensions here
      colors: {
         // It's also good practice to define your CSS variable colors here
         // so you can use them with Tailwind utilities, e.g., bg-accent
        'accent': 'var(--accent-color)',
      }
    },
  },
  plugins: [],
}
