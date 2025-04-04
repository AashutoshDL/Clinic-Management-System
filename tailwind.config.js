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
        buttonGray: '#575757',
        buttonGrayDark: '#3d3d3d',
      },
      animation: {
        barUp1: "barUp1 4s infinite",
        barUp2: "barUp2 4s infinite",
        barUp3: "barUp3 4s infinite",
        barUp4: "barUp4 4s infinite",
        barUp5: "barUp5 4s infinite",
        ball624: "ball624 4s infinite",
      },
      keyframes: {
        ball624: {
          "0%": { transform: "translate(0, 0)" },
          "5%": { transform: "translate(8px, -14px)" },
          "10%": { transform: "translate(15px, -10px)" },
          "17%": { transform: "translate(23px, -24px)" },
          "20%": { transform: "translate(30px, -20px)" },
          "27%": { transform: "translate(38px, -34px)" },
          "30%": { transform: "translate(45px, -30px)" },
          "37%": { transform: "translate(53px, -44px)" },
          "40%": { transform: "translate(60px, -40px)" },
          "50%": { transform: "translate(60px, 0)" },
          "57%": { transform: "translate(53px, -14px)" },
          "60%": { transform: "translate(45px, -10px)" },
          "67%": { transform: "translate(37px, -24px)" },
          "70%": { transform: "translate(30px, -20px)" },
          "77%": { transform: "translate(22px, -34px)" },
          "80%": { transform: "translate(15px, -30px)" },
          "87%": { transform: "translate(7px, -44px)" },
          "90%": { transform: "translate(0, -40px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        barUp1: {
          "0%": { transform: "scale(1, 0.2)" },
          "40%": { transform: "scale(1, 0.2)" },
          "50%": { transform: "scale(1, 1)" },
          "90%": { transform: "scale(1, 1)" },
          "100%": { transform: "scale(1, 0.2)" },
        },
        barUp2: {
          "0%": { transform: "scale(1, 0.4)" },
          "40%": { transform: "scale(1, 0.4)" },
          "50%": { transform: "scale(1, 0.8)" },
          "90%": { transform: "scale(1, 0.8)" },
          "100%": { transform: "scale(1, 0.4)" },
        },
        barUp3: {
          "0%": { transform: "scale(1, 0.6)" },
          "100%": { transform: "scale(1, 0.6)" },
        },
        barUp4: {
          "0%": { transform: "scale(1, 0.8)" },
          "40%": { transform: "scale(1, 0.8)" },
          "50%": { transform: "scale(1, 0.4)" },
          "90%": { transform: "scale(1, 0.4)" },
          "100%": { transform: "scale(1, 0.8)" },
        },
        barUp5: {
          "0%": { transform: "scale(1, 1)" },
          "40%": { transform: "scale(1, 1)" },
          "50%": { transform: "scale(1, 0.2)" },
          "90%": { transform: "scale(1, 0.2)" },
          "100%": { transform: "scale(1, 1)" },
        },
      },
    },
  },
  plugins: [],
};
