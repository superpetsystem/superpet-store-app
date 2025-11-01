import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Vaccines,
  Warning,
  CheckCircle,
  Schedule,
  Download,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { useVaccinations } from '../hooks/useVaccinations';
import { VaccineStatus } from '../../../types';

interface VaccinationsPageProps {
  petId?: string; // Se fornecido, mostra apenas vacinas deste pet
  isCustomerView?: boolean; // Se true, é a visão do cliente (sem botão de adicionar)
}

const VaccinationsPage: React.FC<VaccinationsPageProps> = ({  petId,
  isCustomerView = false,
}) => {
  const { isDark } = useThemeMode();
  const {
    vaccinations,
    loading,
    loadVaccinations,
    loadVaccinationsByPet,
    getUpcomingVaccinations,
    exportVaccinationCard,
  } = useVaccinations();

  const [statusFilter, setStatusFilter] = useState<VaccineStatus | 'all'>('all');
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    if (petId) {
      loadVaccinationsByPet(petId);
    } else {
      loadVaccinations();
    }

    // Carregar vacinas próximas do vencimento
    getUpcomingVaccinations(30).then((response) => {
      if (response.success && response.data) {
        setUpcomingCount(response.data.length);
      }
    });
  }, [petId, loadVaccinations, loadVaccinationsByPet, getUpcomingVaccinations]);

  const filteredVaccinations = vaccinations.filter(
    (v) => statusFilter === 'all' || v.status === statusFilter
  );

  const getStatusColor = (status: VaccineStatus) => {
    const colors = {
      applied: '#4CAF50',
      pending: '#FF9800',
      overdue: '#F44336',
    };
    return colors[status];
  };

  const getStatusLabel = (status: VaccineStatus) => {
    const labels = {
      applied: 'Aplicada',
      pending: 'Pendente',
      overdue: 'Vencida',
    };
    return labels[status];
  };

  const stats = {
    total: filteredVaccinations.length,
    applied: filteredVaccinations.filter((v) => v.status === 'applied').length,
    pending: filteredVaccinations.filter((v) => v.status === 'pending').length,
    overdue: filteredVaccinations.filter((v) => v.status === 'overdue').length,
  };

  const handleExport = async () => {
    if (!petId) return;
    const response = await exportVaccinationCard(petId);
    if (response.success) {
      alert('Carteira de vacinação exportada com sucesso!');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 0.5, ...typography.h4 }}
          >
            💉 {isCustomerView ? 'Vacinação do Meu Pet' : 'Ficha de Vacinação'}
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            {isCustomerView
              ? 'Histórico completo de vacinas'
              : 'Gerencie o histórico de vacinação dos pets'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {petId && (
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              sx={{
                borderColor: isDark ? '#12888A' : '#0E6A6B',
                color: isDark ? '#12888A' : '#0E6A6B',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(18, 136, 138, 0.1)' : 'rgba(14, 106, 107, 0.08)',
                },
              }}
            >
              Exportar
            </Button>
          )}
          {!isCustomerView && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#E47B24',
                color: '#F8F5EE',
                fontWeight: 600,
                '&:hover': { bgcolor: '#C26619' },
              }}
            >
              Nova Vacina
            </Button>
          )}
        </Box>
      </Box>

      {/* Alertas */}
      {upcomingCount > 0 && (
        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{
            mb: 3,
            bgcolor: isDark ? 'rgba(255, 152, 0, 0.1)' : undefined,
            color: isDark ? '#F8F5EE' : undefined,
            '& .MuiAlert-icon': { color: '#FF9800' },
          }}
        >
          <Typography variant="body2" fontWeight="600">
            {upcomingCount} vacina{upcomingCount > 1 ? 's' : ''} próxima{upcomingCount > 1 ? 's' : ''} do vencimento nos próximos 30 dias
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total', value: stats.total, color: '#0E6A6B', icon: <Vaccines /> },
          { label: 'Aplicadas', value: stats.applied, color: '#4CAF50', icon: <CheckCircle /> },
          { label: 'Pendentes', value: stats.pending, color: '#FF9800', icon: <Schedule /> },
          { label: 'Vencidas', value: stats.overdue, color: '#F44336', icon: <Warning /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? `1px solid ${stat.color}` : 'none',
                borderLeft: `4px solid ${stat.color}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filtros */}
      <Card
        sx={{
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '1px solid #12888A' : 'none',
          mb: 3,
        }}
      >
        <CardContent>
          <TextField
            select
            fullWidth
            size="small"
            label="Filtrar por Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
              },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
              '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
            }}
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="applied">Aplicadas</MenuItem>
            <MenuItem value="pending">Pendentes</MenuItem>
            <MenuItem value="overdue">Vencidas</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {/* Lista de Vacinações */}
      <Card
        sx={{
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '1px solid #12888A' : 'none',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Histórico de Vacinação
          </Typography>

          {loading ? (
            <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
              Carregando...
            </Typography>
          ) : filteredVaccinations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Vaccines sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
              <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                Nenhuma vacinação encontrada
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredVaccinations.map((vaccination, index) => (
                <ListItem
                  key={vaccination.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < filteredVaccinations.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    '&:hover': {
                      borderColor: '#E47B24',
                      boxShadow: 2,
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(vaccination.status) }}>
                      <Vaccines />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                          {vaccination.vaccineName}
                        </Typography>
                        <Chip
                          label={getStatusLabel(vaccination.status)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(vaccination.status),
                            color: '#FFF',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        {!petId && (
                          <Typography component="span" variant="body1" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 600, display: 'block' }}>
                            🐾 {vaccination.petName}
                          </Typography>
                        )}
                        <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                          📅 Aplicação: {new Date(vaccination.applicationDate).toLocaleDateString('pt-BR')}
                        </Typography>
                        {vaccination.nextDoseDate && (
                          <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                            🔔 Próxima dose: {new Date(vaccination.nextDoseDate).toLocaleDateString('pt-BR')}
                          </Typography>
                        )}
                        {vaccination.veterinarianName && (
                          <Typography component="span" variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block' }}>
                            👨‍⚕️ {vaccination.veterinarianName} {vaccination.veterinarianCrmv ? `(${vaccination.veterinarianCrmv})` : ''}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VaccinationsPage;

