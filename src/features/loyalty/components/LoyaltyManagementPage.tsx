import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Stars,
  TrendingUp,
  People,
  Redeem,
  Add,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { loyaltyApi } from '../api/loyaltyApi';
import { LoyaltyProgram, LoyaltyReward } from '../../../types';

const LoyaltyManagementPage = () => {
  const { isDark } = useThemeMode();
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [createRewardDialog, setCreateRewardDialog] = useState(false);

  // Form states
  const [rewardName, setRewardName] = useState('');
  const [rewardDesc, setRewardDesc] = useState('');
  const [rewardCost, setRewardCost] = useState(100);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [programsRes, rewardsRes, statsRes] = await Promise.all([
      loyaltyApi.getAll(),
      loyaltyApi.getRewards(),
      loyaltyApi.getStatistics(),
    ]);

    if (programsRes.success && programsRes.data) setPrograms(programsRes.data);
    if (rewardsRes.success && rewardsRes.data) setRewards(rewardsRes.data);
    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    setLoading(false);
  };

  const handleCreateReward = async () => {
    const response = await loyaltyApi.createReward({
      name: rewardName,
      description: rewardDesc,
      pointsCost: rewardCost,
      active: true,
    });

    if (response.success) {
      setCreateRewardDialog(false);
      setRewardName('');
      setRewardDesc('');
      setRewardCost(100);
      loadData();
      alert('✅ Recompensa criada!');
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return '#B9F2FF';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      default: return '#CD7F32';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'Platina';
      case 'gold': return 'Ouro';
      case 'silver': return 'Prata';
      default: return 'Bronze';
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        ⭐ Programa de Fidelidade
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Gerencie membros e recompensas
      </Typography>

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total de Membros', value: stats.totalMembers, icon: <People />, color: '#2196F3' },
            { label: 'Membros Ativos', value: stats.activeMembers, icon: <TrendingUp />, color: '#4CAF50' },
            { label: 'Pontos Emitidos', value: stats.totalPointsIssued.toLocaleString(), icon: <Stars />, color: '#E47B24' },
            { label: 'Taxa de Resgate', value: `${stats.redemptionRate.toFixed(1)}%`, icon: <Redeem />, color: '#9C27B0' },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? `1px solid ${stat.color}` : 'none', borderLeft: `4px solid ${stat.color}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>{stat.icon}</Avatar>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Members Table */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                Membros do Programa
              </Typography>
              <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Cliente</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Nível</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Pontos</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Gasto Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {programs.map(program => (
                      <TableRow key={program.id} hover>
                        <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{program.customerName}</TableCell>
                        <TableCell>
                          <Chip
                            label={getTierLabel(program.tier)}
                            size="small"
                            sx={{
                              bgcolor: getTierColor(program.tier),
                              color: '#0E6A6B',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#E47B24', fontWeight: 600 }}>{program.availablePoints}</TableCell>
                        <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>R$ {program.lifetimeSpent.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Rewards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
                  Recompensas
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setCreateRewardDialog(true)}
                  sx={{ color: '#E47B24' }}
                >
                  Nova
                </Button>
              </Box>
              {rewards.map(reward => (
                <Card
                  key={reward.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    mb: 2,
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                        {reward.name}
                      </Typography>
                      <Chip
                        label={`${reward.pointsCost} pts`}
                        size="small"
                        sx={{ bgcolor: '#4CAF50', color: '#FFF' }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      {reward.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Reward Dialog */}
      <Dialog open={createRewardDialog} onClose={() => setCreateRewardDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          🎁 Nova Recompensa
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            value={rewardName}
            onChange={(e) => setRewardName(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
            }}
          />
          <TextField
            fullWidth
            label="Descrição"
            multiline
            rows={3}
            value={rewardDesc}
            onChange={(e) => setRewardDesc(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
            }}
          />
          <TextField
            fullWidth
            type="number"
            label="Custo em Pontos"
            value={rewardCost}
            onChange={(e) => setRewardCost(parseInt(e.target.value) || 0)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setCreateRewardDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreateReward}
            disabled={!rewardName || !rewardDesc || rewardCost <= 0}
            sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoyaltyManagementPage;

