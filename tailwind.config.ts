import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NeuroReset Brand Colors - Deep Night Blue to Electric Purple
        neuro: {
          // Deep Night Blues (Background)
          900: '#0a0e27', // Darkest - Main background
          800: '#121837', // Dark background
          700: '#1a2347', // Mid dark
          // Electric Blues to Purple (Accents)
          600: '#2d4a9e', // Deep Electric Blue
          500: '#4d6fd8', // Electric Blue
          400: '#6b8ef5', // Bright Blue
          300: '#8b5cf6', // Purple transition
          200: '#a78bfa', // Light Purple
          100: '#c4b5fd', // Very light purple
          50: '#ede9fe',  // Subtle purple tint
        },
        // Cyan Neon Accents
        cyan: {
          500: '#06b6d4',
          400: '#22d3ee',
          300: '#67e8f9',
          glow: '#00ffff', // Neon cyan for glows
        },
        // Resumox Brand Colors
        resumox: {
          bg: '#0A0A0F',
          surface: '#13131A',
          surface2: '#1A1A24',
          surface3: '#22222E',
          border: '#2A2A3A',
          text: '#E8E8ED',
          muted: '#8888A0',
          accent: '#6C5CE7',
          'accent-light': '#A29BFE',
          gold: '#F0C040',
          green: '#00D68F',
          red: '#FF6B6B',
          orange: '#FFA94D',
          blue: '#4DABF7',
        },
        // Keep primary as alias for backward compatibility
        primary: {
          50: '#ede9fe',
          100: '#c4b5fd',
          200: '#a78bfa',
          300: '#8b5cf6',
          400: '#6b8ef5',
          500: '#4d6fd8',
          600: '#2d4a9e',
          700: '#1a2347',
          800: '#121837',
          900: '#0a0e27',
        },
      },
      backgroundImage: {
        'neuro-gradient': 'linear-gradient(135deg, #2d4a9e 0%, #8b5cf6 50%, #4d6fd8 100%)',
        'neuro-dark': 'linear-gradient(180deg, #0a0e27 0%, #121837 100%)',
        'neuro-glow': 'radial-gradient(circle at center, rgba(77, 111, 216, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neuro-glow': '0 0 20px rgba(77, 111, 216, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
        'neuro-card': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'cyan-glow': '0 0 15px rgba(6, 182, 212, 0.5)',
      },
      backdropBlur: {
        'neuro': '16px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float-slow': 'floatSlow 20s ease-in-out infinite',
        'float-delayed': 'floatDelayed 25s ease-in-out infinite',
        'float-medium': 'floatMedium 18s ease-in-out infinite',
        'float-slow-reverse': 'floatSlowReverse 22s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'glow-pink': 'glowPink 3s ease-in-out infinite',
        'rainbow-glow': 'rainbowGlow 4s ease-in-out infinite',
        'shadow-pulse': 'shadowPulse 2s ease-in-out infinite',
        'mega-glow': 'megaGlow 2.5s ease-in-out infinite',
        'orbit-glow': 'orbitGlow 8s linear infinite',
        'orbit-resumox': 'orbitResumox 8s linear infinite',
        'spin': 'spin 1s linear infinite',
        'xp-pop': 'xpPop 1.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(77, 111, 216, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(77, 111, 216, 0.6), 0 0 40px rgba(139, 92, 246, 0.4)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -30px) scale(1.05)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(20px, 30px) scale(1.02)' },
        },
        floatDelayed: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(-40px, 30px) rotate(5deg)' },
          '66%': { transform: 'translate(30px, -20px) rotate(-5deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-30px, -40px) scale(1.1)' },
        },
        floatSlowReverse: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '25%': { transform: 'translate(-25px, 25px) rotate(-3deg) scale(0.98)' },
          '50%': { transform: 'translate(25px, -25px) rotate(3deg) scale(1.03)' },
          '75%': { transform: 'translate(-30px, -20px) rotate(-2deg) scale(0.97)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPink: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        rainbowGlow: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
        shadowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 40px rgba(244, 63, 94, 0.3), inset 0 0 30px rgba(236, 72, 153, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 60px rgba(244, 63, 94, 0.5), inset 0 0 40px rgba(236, 72, 153, 0.3)'
          },
        },
        megaGlow: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.6))'
          },
          '50%': {
            filter: 'drop-shadow(0 0 40px rgba(34, 211, 238, 0.9))'
          },
        },
        orbitGlow: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        orbitResumox: {
          '0%': { transform: 'rotate(0deg) translateX(88px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(88px) rotate(-360deg)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        xpPop: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '1', transform: 'translateY(-12px) scale(1.15)' },
          '100%': { opacity: '0', transform: 'translateY(-24px) scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
