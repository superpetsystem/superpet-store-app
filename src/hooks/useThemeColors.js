import { useThemeMode } from '../context/ThemeContext'

// Hook customizado para facilitar o uso de cores condicionais
export const useThemeColors = () => {
  const { isDark } = useThemeMode()

  return {
    // Backgrounds
    bgPrimary: isDark ? '#0D1117' : '#F2EBDD',
    bgPaper: isDark ? '#1C2128' : '#F8F5EE',
    bgSidebar: isDark ? '#1C2128' : '#F8F5EE',
    bgCard: isDark ? '#1C2128' : '#F8F5EE',
    bgCardHover: isDark ? '#21262D' : '#FFFFFF',
    
    // Textos
    textPrimary: isDark ? '#F8F5EE' : '#1E1E1E',
    textSecondary: isDark ? '#E6E1D6' : '#0E6A6B',
    textMuted: isDark ? '#8B949E' : '#6E6E6E',
    
    // Cores principais (fixas)
    primary: '#0E6A6B',
    primaryDark: '#0A5152',
    primaryLight: '#12888A',
    secondary: '#E47B24',
    secondaryDark: '#C26619',
    secondaryLight: '#F89042',
    
    // Bordas e divisores
    border: isDark ? '#12888A' : '#0E6A6B',
    borderSubtle: isDark ? '#21262D' : '#E0E0E0',
    divider: isDark ? '#12888A' : '#0E6A6B',
    
    // Especiais
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    isDark,
  }
}

export default useThemeColors

