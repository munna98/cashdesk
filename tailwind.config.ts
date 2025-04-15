// tailwind.config.js
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
        addUtilities({
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          },
          '.scrollbar-hide::-webkit-scrollbar': {
            'display': 'none',
          },
        });
      },
    ],
    // darkMode: 'class', 
  };