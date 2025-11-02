import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Stars,
  TrendingUp,
  Redeem,
  EmojiEvents,
  History,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { loyaltyApi } from '../../features/loyalty/api/loyaltyApi';
import { LoyaltyProgram, PointsTransaction, LoyaltyReward } from '../../types';

const CustomerLoyaltyPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);

  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemDialog, setRedeemDialog] = useState<LoyaltyReward | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    const [programRes, transactionsRes, rewardsRes] = await Promise.all([
      loyaltyApi.getByCustomer(user.id),
      loyaltyApi.getTransactions(user.id),
      loyaltyApi.getRewards(),
    ]);

    if (programRes.success && programRes.data) setProgram(programRes.data);
    if (transactionsRes.success && transactionsRes.data) setTransactions(transactionsRes.data);
    if (rewardsRes.success && rewardsRes.data) setRewards(rewardsRes.data);
    setLoading(false);
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

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (!user || !program) return;

    if (program.availablePoints < reward.pointsCost) {
      alert('Pontos insuficientes!');
      return;
    }

    const response = await loyaltyApi.redeemPoints(
      user.id,
      reward.pointsCost,
      `Resgate: ${reward.name}`
    );

    if (response.success && response.data) {
      setProgram(response.data.program);
      setTransactions([response.data.transaction, ...transactions]);
      setRedeemDialog(null);
      alert('🎉 Recompensa resgatada com sucesso!');
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  const handleJoin = async () => {
    if (!user) return;

    const res = await loyaltyApi.createProgram(user.id, user.name);
    if (res.success && res.data) {
      setProgram(res.data);
      alert('🎉 Bem-vindo ao Programa de Fidelidade!');
      loadData();
    }
  };

  if (!program) {
    return (
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', textAlign: 'center', py: 6 }}>
        <Stars sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
        <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 2 }}>
          Você ainda não faz parte do Programa de Fidelidade!
        </Typography>
        <Button variant="contained" onClick={handleJoin} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
          Participar Agora
        </Button>
      </Card>
    );
  }

  const tierProgress = ((program.lifetimeSpent % 5000) / 5000) * 100;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        ⭐ Programa de Fidelidade
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Acumule pontos e troque por recompensas incríveis!
      </Typography>

      {/* Tier Card */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? `2px solid ${getTierColor(program.tier)}` : `2px solid ${getTierColor(program.tier)}`, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: getTierColor(program.tier), width: 64, height: 64 }}>
                <EmojiEvents sx={{ fontSize: 40, color: '#0E6A6B' }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: getTierColor(program.tier) }}>
                  Nível {getTierLabel(program.tier).toUpperCase()}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  Membro desde {new Date(program.joinDate).toLocaleDateString('pt-BR')}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<Stars />}
              label={`${program.availablePoints} pontos`}
              sx={{
                bgcolor: '#E47B24',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                px: 2,
                py: 3,
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 1 }}>
              Progresso para o próximo nível: R$ {program.lifetimeSpent.toFixed(2)} / R$ 5.000,00
            </Typography>
            <LinearProgress
              variant="determinate"
              value={tierProgress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: isDark ? '#0D1117' : '#E0E0E0',
                '& .MuiLinearProgress-bar': { bgcolor: getTierColor(program.tier) },
              }}
            />
          </Box>

          <Typography variant="caption" sx={{ color: isDark ? '#12888A' : '#999' }}>
            💰 Cashback acumulado: R$ {program.cashbackBalance.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Recompensas Disponíveis */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                🎁 Recompensas Disponíveis
              </Typography>
              <Grid container spacing={2}>
                {rewards.map(reward => (
                  <Grid item xs={12} sm={6} key={reward.id}>
                    <Card
                      sx={{
                        bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                        border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Redeem sx={{ color: '#E47B24', fontSize: 32 }} />
                          <Chip
                            label={`${reward.pointsCost} pts`}
                            size="small"
                            sx={{ bgcolor: '#4CAF50', color: '#FFF', fontWeight: 600 }}
                          />
                        </Box>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 1 }}>
                          {reward.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 2 }}>
                          {reward.description}
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          disabled={program.availablePoints < reward.pointsCost}
                          onClick={() => setRedeemDialog(reward)}
                          sx={{
                            bgcolor: '#E47B24',
                            '&:hover': { bgcolor: '#C26619' },
                            '&:disabled': { bgcolor: '#CCC', color: '#666' },
                          }}
                        >
                          {program.availablePoints >= reward.pointsCost ? 'Resgatar' : 'Pontos Insuficientes'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Histórico */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                <History sx={{ verticalAlign: 'middle', mr: 1 }} />
                Histórico
              </Typography>
              <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                {transactions.slice(0, 10).map((trans, index) => (
                  <ListItem
                    key={trans.id}
                    sx={{
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      borderRadius: 1,
                      mb: index < Math.min(transactions.length, 10) - 1 ? 1 : 0,
                      border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>
                            {trans.description}
                          </Typography>
                          <Chip
                            label={`${trans.points > 0 ? '+' : ''}${trans.points}`}
                            size="small"
                            sx={{
                              bgcolor: trans.points > 0 ? '#4CAF50' : '#F44336',
                              color: '#FFF',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                          {new Date(trans.timestamp).toLocaleString('pt-BR')}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Redeem Dialog */}
      <Dialog open={!!redeemDialog} onClose={() => setRedeemDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          Confirmar Resgate
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', mt: 2 }}>
            Deseja resgatar "{redeemDialog?.name}" por {redeemDialog?.pointsCost} pontos?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setRedeemDialog(null)}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
            onClick={() => redeemDialog && handleRedeem(redeemDialog)}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerLoyaltyPage;

