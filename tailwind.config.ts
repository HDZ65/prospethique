import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa',
        },
        accent: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8',
        },
        surface: {
          DEFAULT: 'rgba(15, 23, 42, 0.98)',
          hover: 'rgba(17, 25, 45, 0.98)',
          active: 'rgba(19, 27, 48, 1)',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#e2e8f0',
          tertiary: '#94a3b8',
        }
      },
      backgroundImage: {
        'gradient-app': 'linear-gradient(180deg, #0f172a, #1e293b)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
        'gradient-button': 'linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))',
      },
      boxShadow: {
        'glass': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'glass-hover': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'neo': '0 4px 20px -6px rgba(59, 130, 246, 0.15), 0 12px 28px -12px rgba(99, 102, 241, 0.15)',
        'input': 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
        'button': '0 1px 3px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(59, 130, 246, 0.15)',
      },
      backdropBlur: {
        'glass': '16px',
      },
    },
  },
  plugins: [],
}

export default config
