import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        dmserif: ["var(--font-dmserif)", "serif"],
        dmsans: ["var(--font-dmsans)", "sans-serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        brand: "#C026D3",
        accent: "#F472B6",

        background: "#0A0614",
        foreground: "#FFFFFF",

        primary: {
          DEFAULT: "#C026D3",
          foreground: "#FFFFFF",
        },

        secondary: {
          DEFAULT: "#1A1025",
          foreground: "#FFFFFF",
        },

        muted: {
          DEFAULT: "#221433",
          foreground: "#A78BFA",
        },

        "bg-base": "#0A0614",
        "bg-surface": "#1A1025",
        "bg-elevated": "#221433",

        card: "#1A1025",
        popover: "#1A1025",

        "text-primary": "#FFFFFF",
        "text-secondary": "#D8B4FE",
        "text-muted": "#B8A1C9",

        border: "#312145",

        success: "#22C55E",
        danger: "#EF4444",

        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
