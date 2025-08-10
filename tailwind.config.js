import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        dark: '#1b1b1b',
        light: '#fff',
        accent: '#7B00D3', 
        accentDark: '#ffdb4d',
        gray: '#747474',
      },
      fontFamily: {
        mr: ['var(--font-mr)'],
        in: ['var(--font-in)'],
      },
      animation: {
        roll: 'roll 24s linear infinite',
      },
      keyframes: {
        roll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      screens: {
        sxl: '1180px',
        xs: '480px',
      },
    },
  },
  plugins: [
    typography,
  ],
};

