/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        "18px": "18px",
        "19px": "19px",
        "20px": "20px",
      },
      fontSize: {
        "8px": '8px',
        "9px": '9px',
        "10px": '10px',
        "11px": '11px',
        "12px": '12px',
        "13px": '13px',
        "14px": '14px',
        "15px": '15px',
        "16px": '16px',
        "17px": '17px',
        "30px": '30px',
      },
      height: {
        "10px": '10px',
        "26px": '26px',
        'h-43p': '43px',
        "50px": '50px',
        "87px": '87px',
        "147px": '147px',
      },
      width: {
        "90vw": "90vw",
        "95vw": "95vw",
      },
      gap: {
        "10": '10px',
      },
      colors: {
        "black": {
          "0": '#1C1C1C',
        },
        "red": {
          "0": '#FF4141',
          "1": '#C3501A',
        },
        'purple': {
          light: '#4E17A8',
          dark: '#341C6E',
        },
        'orange': {
          light: '#FF610F',
          dark: '#C3501A',
          "light-100": "#FFC1A1",
        },
        'gray': {
          "light-100": "#F4F4F4",
          "light-D3": "#D3D3D3",
          "light-D5": "#D5D5D5",
          "light-99": "#999999",
          "light-F5": "#F5ECEC",
          "light-F8": "#F8F8F8",
          "light-300": "#F4F5F8",
          "light-400": "#E9E9E9",
          light: '#EFEFEF',
          dark: '#333',
          "dark-100": "#686868",
          "dark-200": "#807B7B",
          "dark-80": "#807B7B",
          "dark-F6": "#F6F6F6",
          "gray-0": "#7C7C7C",
          "gray-1": "#595959",
          "gray-E3": "#E3E3E3",
        },
        "yellow": {
          "500": "#FFC320",
        },
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(90deg, #4E17A8 0%, #341C6E 100%)',
        'orange-gradient': 'linear-gradient(90deg, #C3501A 0%, #FF610F 100%)',
        'purple-gradient-light': 'linear-gradient(90deg, #4E17A81A 0%, #341C6E1A 100%)',
        'purple-gradient-light-2': 'linear-gradient(90deg, #4E17A81A 0%, #341C6E1A 0%)',
        'orange-gradient-light': 'linear-gradient(90deg, #FF610F1A 0%, #FF610F1A 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-left': 'slideInLeft 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            a: {
              color: '#4E17A8',
              '&:hover': {
                color: '#341C6E',
              },
            },
            h2: {
              fontWeight: '700',
            },
            h3: {
              fontWeight: '600',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: '#555',
            },
            img: {
              borderRadius: '0.5rem',
            },
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),

    plugin(function ({ addUtilities }) {
      addUtilities({
        '.text-gradient-purple': {
          background: 'linear-gradient(90deg, #4E17A8 0%, #341C6E 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-orange': {
          background: 'linear-gradient(90deg, #C3501A 0%, #FF610F 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.mobile-container': {
          width: '100%',
          maxWidth: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
        '.border-orange-gradient': {
          borderImage: 'linear-gradient(90deg, #C3501A 0%, #FF610F 100%) 1',
          borderStyle: 'solid',
        },
        '.shadow-orange-gradient': {
          boxShadow: '0 4px 6px -1px rgba(195, 80, 26, 0.1), 0 2px 4px -1px rgba(255, 97, 15, 0.06)',
        },
      });
    }),
  ],
}
