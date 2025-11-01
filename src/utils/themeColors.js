// Utilitário para cores do tema SuperPet
// Use este helper nos componentes para facilitar a troca de tema

export const getThemeColors = (isDark) => ({
  // Backgrounds
  bgPrimary: isDark ? '#1E1E1E' : '#F2EBDD',
  bgPaper: isDark ? '#2D2D2D' : '#F8F5EE',
  bgSidebar: isDark ? '#2D2D2D' : '#F8F5EE',
  
  // Textos
  textPrimary: isDark ? '#F8F5EE' : '#1E1E1E',
  textSecondary: isDark ? '#12888A' : '#0E6A6B',
  textOnPrimary: '#F8F5EE',
  
  // Cores principais (não mudam)
  primary: '#0E6A6B',
  primaryDark: '#0A5152',
  primaryLight: '#12888A',
  secondary: '#E47B24',
  secondaryDark: '#C26619',
  secondaryLight: '#F89042',
  
  // Cores fixas
  light: '#F8F5EE',
  dark: '#1E1E1E',
  
  // Bordas e divisores
  border: '#0E6A6B',
  divider: isDark ? '#12888A' : '#0E6A6B',
})

export default getThemeColors

