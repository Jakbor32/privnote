/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "text-reveal": "text-reveal 2s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
      },
      keyframes: {
        "text-reveal": {
          "0%": {
            transform: "translate(0, 100%)",
            opacity: 1
          },
          "50%": {
            transform: "translate(0, 0)",
            opacity: 1
          },
          "100%": {
            transform: "translate(0, 100%)",
           opacity: 0
          },
        },
      },
    },
  },
  plugins: [],
}