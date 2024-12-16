import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#1460a1',
        second: '#1da6e0',
        tabMenu: "#f8fafb",
      },
      screens:{
        large:'1400px',
      },
      maxHeight:{
        sizeTab:"62vh",
        tableHeight:"515px",
      },
      width:{
        short:"270px",
      }
    },
  },
  plugins: [],
};
export default config;
