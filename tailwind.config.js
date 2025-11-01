/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        superpet: {
          primary: '#0E6A6B',      // Teal escuro - fundo principal
          secondary: '#E47B24',     // Laranja quente - detalhes/CTA
          light: '#F8F5EE',         // Branco gelo - texto principal
          background: '#F2EBDD',    // Off-white - fundo neutro
          dark: '#1E1E1E',          // Preto de apoio - texto escuro
          'primary-dark': '#0A5152', // Variação mais escura do primary
          'primary-light': '#12888A', // Variação mais clara do primary
          'secondary-dark': '#C26619', // Variação mais escura do secondary
          'secondary-light': '#F89042', // Variação mais clara do secondary
        },
      },
    },
  },
  plugins: [],
  important: true, // Para garantir que Tailwind sobrescreva Material UI quando necessário
}

