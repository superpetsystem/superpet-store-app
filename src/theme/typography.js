/**
 * 📐 Sistema de Tipografia Responsiva SuperPet
 * 
 * Tamanhos otimizados para Mobile e Desktop
 */

export const fontSizes = {
  // Headings
  h1: {
    xs: '1.75rem',   // 28px mobile
    sm: '2rem',      // 32px tablet
    md: '2.5rem',    // 40px desktop
  },
  h2: {
    xs: '1.5rem',    // 24px mobile
    sm: '1.75rem',   // 28px tablet
    md: '2rem',      // 32px desktop
  },
  h3: {
    xs: '1.25rem',   // 20px mobile
    sm: '1.5rem',    // 24px tablet
    md: '1.75rem',   // 28px desktop
  },
  h4: {
    xs: '1.125rem',  // 18px mobile
    sm: '1.25rem',   // 20px tablet
    md: '1.5rem',    // 24px desktop
  },
  h5: {
    xs: '1rem',      // 16px mobile
    sm: '1.125rem',  // 18px tablet
    md: '1.25rem',   // 20px desktop
  },
  h6: {
    xs: '0.875rem',  // 14px mobile
    sm: '1rem',      // 16px tablet
    md: '1.125rem',  // 18px desktop
  },

  // Body
  body1: {
    xs: '0.875rem',  // 14px mobile
    sm: '0.9375rem', // 15px tablet
    md: '1rem',      // 16px desktop
  },
  body2: {
    xs: '0.8125rem', // 13px mobile
    sm: '0.875rem',  // 14px tablet
    md: '0.9375rem', // 15px desktop
  },

  // Small text
  caption: {
    xs: '0.6875rem', // 11px mobile
    sm: '0.75rem',   // 12px tablet
    md: '0.8125rem', // 13px desktop
  },
  small: {
    xs: '0.75rem',   // 12px mobile
    sm: '0.8125rem', // 13px tablet
    md: '0.875rem',  // 14px desktop
  },

  // Buttons
  button: {
    xs: '0.875rem',  // 14px mobile
    sm: '0.9375rem', // 15px tablet
    md: '1rem',      // 16px desktop
  },
  buttonLarge: {
    xs: '1rem',      // 16px mobile
    sm: '1.0625rem', // 17px tablet
    md: '1.125rem',  // 18px desktop
  },
}

/**
 * Helper para aplicar fontSize responsivo facilmente
 * 
 * @param {string} variant - 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'button', 'buttonLarge'
 * @returns {object} - Objeto com breakpoints { xs, sm, md }
 * 
 * @example
 * <Typography sx={{ fontSize: responsiveFontSize('h4') }}>
 */
export const responsiveFontSize = (variant) => {
  return fontSizes[variant] || fontSizes.body1
}

/**
 * Atalhos para uso rápido
 */
export const typography = {
  // Títulos de página
  pageTitle: fontSizes.h4,
  pageSubtitle: fontSizes.body1,
  
  // Títulos de seção
  sectionTitle: fontSizes.h5,
  sectionSubtitle: fontSizes.body2,
  
  // Cards
  cardTitle: fontSizes.h6,
  cardValue: fontSizes.h5,
  cardLabel: fontSizes.caption,
  
  // Botões
  buttonText: fontSizes.button,
  buttonLargeText: fontSizes.buttonLarge,
  
  // Texto geral
  bodyText: fontSizes.body1,
  smallText: fontSizes.body2,
  caption: fontSizes.caption,
}

export default typography

