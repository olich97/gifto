const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Gifto brand colors
        flamingo: '#FF4D9D',
        tangerine: '#FF8A39',
        aqua: '#29DFFF',
        midnight: '#0C0E25',
        dusk: '#1B1243',
        violetFog: '#302766',
        success: '#5EF58C',
        warning: '#F9A23C',
        error: '#FF4E4E',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '1.5rem',
      },
      backgroundImage: {
        'gradient-gifto': 'linear-gradient(135deg, #FF4D9D 0%, #FF8A39 100%)',
        'gradient-midnight': 'linear-gradient(180deg, #1B1243 0%, #0C0E25 100%)',
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
