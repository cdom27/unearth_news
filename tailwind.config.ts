import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        stone: {
          50: "var(--stone-50)",
          100: "var(--stone-100)",
          150: "var(--stone-150)",
          200: "var(--stone-200)",
          400: "var(--stone-400)",
          500: "var(--stone-500)",
          600: "var(--stone-600)",
          800: "var(--stone-800)",
          900: "var(--stone-900)",
        },
        brand: {
          500: "var(--brand-500)",
        },
        left: {
          500: "var(--left-500)",
        },
        right: {
          500: "var(--right-500)",
        },
        rating: {
          low: "var(--rating-low)",
          mixed: "var(--rating-mixed)",
          "very-high": "var(--rating-very-high)",
        },
      },
    },
  },
} satisfies Config;
