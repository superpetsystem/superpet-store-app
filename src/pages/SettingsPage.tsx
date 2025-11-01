import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import {
  Settings,
  Store,
  Palette,
  Notifications,
  Security,
  Language,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { typography } from '../theme/typography';

const SettingsPage = () => {
  const { isDark } = useThemeMode();
  const configSections = [
    {
      title: 'Dados da Loja',
      description: 'Configure informações básicas da loja',
      icon: <Store sx={{ fontSize: 48, color: '#E47B24' }} />,
    },
    {
      title: 'Aparência',
      description: 'Personalize cores e tema',
      icon: <Palette sx={{ fontSize: 48, color: '#E47B24' }} />,
    },
    {
      title: 'Notificações',
      description: 'Gerencie alertas e notificações',
      icon: <Notifications sx={{ fontSize: 48, color: '#E47B24' }} />,
    },
    {
      title: 'Segurança',
      description: 'Configurações de segurança e privacidade',
      icon: <Security sx={{ fontSize: 48, color: '#E47B24' }} />,
    },
    {
      title: 'Idioma e Região',
      description: 'Configurar idioma e moeda',
      icon: <Language sx={{ fontSize: 48, color: '#E47B24' }} />,
    },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ 
          color: isDark ? '#12888A' : '#0E6A6B', 
          mb: 1,
          fontSize: typography.pageTitle,
        }}
      >
        Configurações ⚙️
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: isDark ? '#E6E1D6' : '#666', 
          mb: 4,
          fontSize: typography.pageSubtitle,
        }}
      >
        Configure as preferências do sistema SuperPet
      </Typography>

      <Grid container spacing={3}>
        {configSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                boxShadow: 3,
                height: '100%',
                transition: 'all 0.3s',
                border: isDark ? '1px solid #12888A' : 'none',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  cursor: 'pointer',
                  borderColor: isDark ? '#E47B24' : 'transparent',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>{section.icon}</Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ 
                    color: isDark ? '#12888A' : '#0E6A6B', 
                    mb: 1,
                    fontSize: typography.cardTitle,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDark ? '#F8F5EE' : '#1E1E1E', 
                    mb: 2,
                    fontSize: typography.smallText,
                  }}
                >
                  {section.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: isDark ? '#12888A' : '#0E6A6B',
                    color: isDark ? '#12888A' : '#0E6A6B',
                    '&:hover': {
                      borderColor: isDark ? '#E47B24' : '#0A5152',
                      bgcolor: isDark ? '#E47B24' : '#0E6A6B',
                      color: '#F8F5EE',
                    },
                  }}
                >
                  Configurar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SettingsPage;

