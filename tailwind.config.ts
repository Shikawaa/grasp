import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                desk: "var(--desk)",
                paper: "var(--paper)",
                page: "var(--page)",
                rule: "var(--rule)",
                edge: "var(--edge)",
                pencil: "var(--pencil)",
                ink: "var(--ink)",
                "ink-soft": "var(--ink-soft)",
                "ink-faint": "var(--ink-faint)",
                "on-ink": "var(--on-ink)",
                butter: "var(--highlight-butter)",
            },
            borderRadius: {
                page: "var(--radius-page)",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
                written: ["var(--font-fraunces)", "Georgia", "serif"],
                handwritten: ["var(--font-caveat)", "cursive"],
            },
        },
    },
    plugins: [],
};

export default config;
