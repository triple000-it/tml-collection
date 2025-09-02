/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Tomorrowland Brand Colors
      colors: {
        // Primary Tomorrowland Colors
        'tml': {
          // Deep purples and magentas (main brand colors)
          'purple': '#581C87',        // Dark purple (purple-900)
          'purple-dark': '#4C1D95',   // Darker purple
          'purple-light': '#7C3AED',  // Lighter purple
          'magenta': '#EC4899',       // Tomorrowland magenta
          'magenta-dark': '#DB2777',  // Darker magenta
          'magenta-light': '#F472B6', // Lighter magenta
          
          // Blues and teals
          'blue': '#1E3A8A',          // Dark blue (blue-900)
          'blue-dark': '#1E40AF',     // Darker blue
          'blue-light': '#3B82F6',    // Lighter blue
          'teal': '#14B8A6',          // Teal accent
          'teal-dark': '#0F766E',     // Darker teal
          
          // Golds and ambers (for legendary cards)
          'gold': '#F59E0B',          // Gold
          'gold-dark': '#D97706',     // Darker gold
          'gold-light': '#FCD34D',    // Lighter gold
          'amber': '#F59E0B',         // Amber
          'amber-dark': '#D97706',    // Darker amber
          
          // Grays and neutrals
          'gray': {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          
          // Dark theme colors
          'dark': {
            'bg': '#0A0A0A',          // Very dark background
            'surface': '#1A1A1A',     // Dark surface
            'border': '#2D2D2D',      // Dark border
            'text': '#FFFFFF',        // White text
            'text-muted': '#A1A1AA',  // Muted text
          }
        },
        
        // Rarity-specific colors
        'rarity': {
          'common': '#6B7280',        // Gray
          'rare': '#3B82F6',          // Blue
          'epic': '#8B5CF6',          // Purple
          'legendary': '#F59E0B',     // Gold
        }
      },
      
      // Tomorrowland Typography
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Montserrat', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      
      // Tomorrowland Gradients
      backgroundImage: {
        'tml-gradient': 'linear-gradient(135deg, #581C87 0%, #EC4899 50%, #1E3A8A 100%)',
        'tml-gradient-dark': 'linear-gradient(135deg, #4C1D95 0%, #DB2777 50%, #1E40AF 100%)',
        'legendary-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%)',
        'epic-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #8B5CF6 100%)',
        'rare-gradient': 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 50%, #3B82F6 100%)',
        'common-gradient': 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 50%, #6B7280 100%)',
      },
      
      // Tomorrowland Shadows and Glows
      boxShadow: {
        'tml': '0 0 20px rgba(107, 70, 193, 0.3)',
        'tml-lg': '0 0 40px rgba(107, 70, 193, 0.4)',
        'magenta': '0 0 20px rgba(236, 72, 153, 0.3)',
        'magenta-lg': '0 0 40px rgba(236, 72, 153, 0.4)',
        'legendary': '0 0 30px rgba(245, 158, 11, 0.6)',
        'legendary-lg': '0 0 50px rgba(245, 158, 11, 0.7)',
        'epic': '0 0 25px rgba(139, 92, 246, 0.5)',
        'epic-lg': '0 0 45px rgba(139, 92, 246, 0.6)',
        'rare': '0 0 20px rgba(59, 130, 246, 0.4)',
        'rare-lg': '0 0 35px rgba(59, 130, 246, 0.5)',
        'common': '0 0 15px rgba(107, 114, 128, 0.3)',
        'common-lg': '0 0 25px rgba(107, 114, 128, 0.4)',
      },
      
      // Tomorrowland Animations
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'legendary-pulse': 'legendary-pulse 2s ease-in-out infinite',
        'epic-shimmer': 'epic-shimmer 3s ease-in-out infinite',
        'rare-sparkle': 'rare-sparkle 4s ease-in-out infinite',
      },
      
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(107, 70, 193, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(107, 70, 193, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(107, 70, 193, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(107, 70, 193, 0.4)' },
        },
        'legendary-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 50px rgba(245, 158, 11, 0.8)',
            transform: 'scale(1.02)'
          },
        },
        'epic-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'rare-sparkle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      
      // Tomorrowland Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Tomorrowland Border Radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // Tomorrowland Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    // Add custom utilities for Tomorrowland styling
    function({ addUtilities }) {
      const newUtilities = {
        '.text-tml-gradient': {
          'background': 'linear-gradient(135deg, #581C87 0%, #EC4899 50%, #1E3A8A 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-legendary-gradient': {
          'background': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-epic-gradient': {
          'background': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #8B5CF6 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-rare-gradient': {
          'background': 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 50%, #3B82F6 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-common-gradient': {
          'background': 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 50%, #6B7280 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-tml-glass': {
          'background': 'rgba(26, 26, 26, 0.8)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(107, 70, 193, 0.2)',
        },
        '.card-flip': {
          'transform-style': 'preserve-3d',
          'transition': 'transform 0.6s',
        },
        '.card-flip:hover': {
          'transform': 'rotateY(180deg)',
        },
        '.card-inner': {
          'position': 'relative',
          'width': '100%',
          'height': '100%',
          'text-align': 'center',
          'transition': 'transform 0.6s',
          'transform-style': 'preserve-3d',
        },
        '.card-front, .card-back': {
          'position': 'absolute',
          'width': '100%',
          'height': '100%',
          'backface-visibility': 'hidden',
        },
        '.card-back': {
          'transform': 'rotateY(180deg)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
