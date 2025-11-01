import { createContext, useState, useContext, useEffect, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeContext = createContext()

export const useThemeMode = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Carrega preferência salva ou usa 'light' como padrão
    return localStorage.getItem('themeMode') || 'light'
  })

  useEffect(() => {
    // Salva preferência quando muda
    localStorage.setItem('themeMode', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0E6A6B',
            dark: '#0A5152',
            light: '#12888A',
            contrastText: '#F8F5EE',
          },
          secondary: {
            main: '#E47B24',
            dark: '#C26619',
            light: '#F89042',
            contrastText: '#F8F5EE',
          },
          background: {
            default: mode === 'light' ? '#F2EBDD' : '#0D1117',
            paper: mode === 'light' ? '#F8F5EE' : '#1C2128',
          },
          text: {
            primary: mode === 'light' ? '#1E1E1E' : '#F8F5EE',
            secondary: mode === 'light' ? '#0E6A6B' : '#12888A',
          },
          divider: mode === 'light' ? '#0E6A6B' : '#12888A',
          action: {
            hover: mode === 'light' ? 'rgba(14, 106, 107, 0.04)' : 'rgba(18, 136, 138, 0.08)',
            selected: mode === 'light' ? 'rgba(14, 106, 107, 0.08)' : 'rgba(18, 136, 138, 0.12)',
          },
        },
        typography: {
          fontFamily: [
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: '#0E6A6B',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#F8F5EE' : '#1C2128',
                borderRadius: 8,
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#F8F5EE' : '#1C2128',
                borderColor: mode === 'light' ? '#0E6A6B' : '#12888A',
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#F8F5EE' : '#1C2128',
                border: `2px solid ${mode === 'light' ? '#0E6A6B' : '#12888A'}`,
              },
            },
          },
        },
      }),
    [mode]
  )

  const value = {
    mode,
    toggleTheme,
    isDark: mode === 'dark',
  }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContext

