/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateRows:{
        app:'64px 1fr 150px',
      },
      backgroundImage: {
        'circle-2': "url('/imgs/circle-2.png')",
      },
      colors: {
        'green-neon': '#028d7f',
      },
    },
  },
  plugins: [],
}

