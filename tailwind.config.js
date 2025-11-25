/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.7)",
        "glass-border": "rgba(255, 255, 255, 0.5)",
        "notebook-gray": "#f0f2f5",
        "trace-line": "#e5e7eb", // gray-200
      },
      borderRadius: {
        'squircle': '1.5rem', // Approximation of squircle
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
