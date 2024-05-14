/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      spacing: {
        '-10px': '-10px',
        '-15px': '-15px',
        'neg-12': '-35px',
        '0px': '0px',
        '10px': '10px',
        '15px': '15px',
        '20':'20px',
        '24px':'24px',
        '30':'30px',
        '15px': '15px',
        '40px': '40px',
        '50px': '50px',
        '70px': '70px',
        '100':'100%'
      }
    },
  },
  plugins: [],
};
