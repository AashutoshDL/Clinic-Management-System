/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['FigTree'],
      },
      colors: {
        buttonGray: '#575757', // Add custom color
        buttonGrayDark: '#3d3d3d',  // Darker shade

      },
    },
  },
  plugins: [],
}