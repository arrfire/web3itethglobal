/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './common/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'violets-are-blue': '#7E5EF2',
        'space-cadet': '#2A2359',
        'eerie-black': '#0e1111',
        'iris': '#4e54c8',
        'light-cobalt-blue': '#8f94fb',
        'han-purple': '#5606FF',
        'tulip': '#FE8989',
      },
    },
    keyframes: {
      ldsLoader: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      rotatingGradient: {
        '0%': { background: '#a855f7' },
        '50%': { background: '#6366f1' },
        '100%': { background: '#a855f7' },
      },
      moveHorizontal: {
        "0%": {
          transform: "translateX(-50%) translateY(-10%)",
        },
        "50%": {
          transform: "translateX(50%) translateY(10%)",
        },
        "100%": {
          transform: "translateX(-50%) translateY(-10%)",
        },
      },
      moveInCircle: {
        "0%": {
          transform: "rotate(0deg)",
        },
        "50%": {
          transform: "rotate(180deg)",
        },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
      moveVertical: {
        "0%": {
          transform: "translateY(-50%)",
        },
        "50%": {
          transform: "translateY(50%)",
        },
        "100%": {
          transform: "translateY(-50%)",
        },
      },
      animatedText: {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
      },
      scaleUpAndDown: {
        "0%": {
          scale: "100%",
        },
        "100%": {
          scale: "100%",
        },
        "50%": {
          scale: "102%",
        },
      },
      pulse: {
        "0%": {
          opacity: "1",
        },
        "100%": {
          opacity: "1",
        },
        "50%": {
          opacity: "0.7",
        },
      },
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
      ldsLoader: 'ldsLoader 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      scaleUpAndDown: "scaleUpAndDown 1s infinite",
      dreamyText: 'animatedText 2s ease-in-out infinite 1s, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
      progressAnimation: 'animatedText 6s ease-in-out infinite',
      animatedText: 'animatedText 3s ease-in-out infinite, pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite, scaleUpAndDown 1s infinite',
      rotatingGradient: 'rotatingGradient 2s cubic-bezier(0.5, 0, 0.5, 1) infinite alternate',
      first: "moveVertical 30s ease infinite",
      second: "moveInCircle 20s reverse infinite",
      third: "moveInCircle 40s linear infinite",
      fourth: "moveHorizontal 40s ease infinite",
      fifth: "moveInCircle 20s ease infinite",
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
  plugins: [
    require('./common/utils/tailwindPlugins/animations'),
  ],
}
