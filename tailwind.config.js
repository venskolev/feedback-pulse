/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'ld-fp-',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Тук можем да добавим специфични цветове за библиотеката в бъдеще,
        // но засега разчитаме на тези от MUI темата, където е възможно.
      }
    },
  },
  plugins: [],
}