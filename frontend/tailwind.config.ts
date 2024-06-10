import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    'node_modules/flowbite-react/lib/esm/**/*.js',
    "./src/**/*.{jsx,tsx,mdx}",
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
  },
  plugins: [
    require("flowbite/plugin"),
  ],
} satisfies Config

export default config