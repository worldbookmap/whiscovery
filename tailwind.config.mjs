/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f9f5ec",
        ink: "#1f1a17",
        oak: "#4f3728",
        amber: "#c98a2e",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Noto Sans KR", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px rgba(36, 24, 14, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
