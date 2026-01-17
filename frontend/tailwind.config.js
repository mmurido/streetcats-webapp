/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#317CD4',
        },

        surface: {
          DEFAULT: '#ffffff',
          hover: '#f5f5f5',
          secondary: '#2B2B2B',
          error: '#FAC7BD',
        },

        text: {
          DEFAULT: '#2B2B2B',
          muted: '#525252',
          placeholder: '#A0A8A8',
          inverted: '#FFFFFF',
          error: '#BF2C0F',
        },

        border: {
          DEFAULT: '#D7D7D7',
          error: '#BF2C0F',
        },
      },

      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },

      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#2B2B2B',
            '--tw-prose-headings': '#2B2B2B',
            '--tw-prose-bold': '#2B2B2B',
            '--tw-prose-hr': '#D7D7D7 ',
            '--tw-prose-links': '#317CD4',
            hr: {
              'margin-top': '2em',
              'margin-bottom': '2em',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
