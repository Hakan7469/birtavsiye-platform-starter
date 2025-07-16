/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pastelPurple: '#e7dbf0',
        pastelBlue: '#dce9f8',
        pastelLilac: '#e2d3f7',
        softGray: '#f4f4f4',
        textDark: '#2e2e2e',
        borderSoft: '#d6d6d6',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
}
