/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './studiopzd.html',
    './js/**/*.js',
  ],
  safelist: [
    {
      pattern: /^bg-(purple|slate)-/,
      variants: ['hover', 'focus'], // Add other variants as needed
    },
    {
      pattern: /^text-(purple|slate)-/,
      variants: ['hover', 'focus'], // Add other variants as needed
    },
    {
      pattern: /^border-(purple|slate)-/,
      variants: ['hover', 'focus'], // Add other variants as needed
    },
    {
      pattern: /^fill-(purple|slate)-/,
      variants: ['hover', 'focus'], // Add other variants as needed
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

