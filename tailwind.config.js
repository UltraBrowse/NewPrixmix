/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./frontend/**/*.{html,js}', './frontend/assets/js/**/*.js', './**/*.py'],
  theme: {
    extend: {},
  },
  plugins: [
	require('daisyui'),
  ],
}

