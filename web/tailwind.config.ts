import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg:      "var(--color-bg-primary)",
          card:    "var(--color-bg-card)",
          hover:   "var(--color-bg-hover)",
          border:  "var(--color-border)",
          "border-subtle": "var(--color-border-subtle)",
          text:    "var(--color-text-primary)",
          muted:   "var(--color-text-secondary)",
          faint:   "var(--color-text-muted)",
          accent:  "var(--color-accent)",
          "accent-fg": "var(--color-accent-fg)",
        },
        dark: {
          bg:      "var(--color-dark-bg-primary)",
          card:    "var(--color-dark-bg-card)",
          elevated:"var(--color-dark-bg-elevated)",
          hover:   "var(--color-dark-bg-hover)",
          border:  "var(--color-dark-border)",
          "border-subtle": "var(--color-dark-border-subtle)",
          text:    "var(--color-dark-text-primary)",
          muted:   "var(--color-dark-text-secondary)",
          faint:   "var(--color-dark-text-muted)",
          accent:  "var(--color-dark-accent)",
          "accent-fg": "var(--color-dark-accent-fg)",
        },
      },
    },
  },
} satisfies Config