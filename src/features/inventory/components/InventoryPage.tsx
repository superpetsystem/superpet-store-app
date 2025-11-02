import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, IconButton } from '@mui/material';
import { Add, CheckCircle } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { inventoryApi } from '../api/inventoryApi';
import { InventoryCount } from '../../../types';

const InventoryPage = () => {
  const { isDark } = useThemeMode();
  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [dialog, setDialog] = useState(false);
  const [completeDialog, setCompleteDialog] = useState<InventoryCount | null>(null);
  const [countedBy, setCountedBy] = useState('Admin');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await inventoryApi.getCounts();
    if (res.success && res.data) setCounts(res.data);
  };

  const handleCreate = async () => {
    const newCount = {
      countDate: new Date().toISOString().split('T')[0],
      status: 'in-progress' as const,
      countedBy,
      items: [],
      totalAdjustments: 0,
      notes,
    };

    const res = await inventoryApi.createCount(newCount);
    if (res.success) {
      setDialog(false);
      setCountedBy('Admin');
      setNotes('');
      loadData();
      alert('✅ Contagem iniciada!');
    }
  };

  const handleComplete = async () => {
    if (!completeDialog) return;

    const res = await inventoryApi.completeCount(completeDialog.id);
    if (res.success) {
      setCompleteDialog(null);
      loadData();
      alert('✅ Contagem completada e ajustes aplicados!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#2196F3';
      default: return '#F44336';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
          📋 Inventário e Ajustes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Nova Contagem
        </Button>
      </Box>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Data</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Contador</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Itens</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Ajustes</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {counts.map(count => (
                  <TableRow key={count.id} hover>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{new Date(count.countDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{count.countedBy}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{count.items.length}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{count.totalAdjustments}</TableCell>
                    <TableCell>
                      <Chip label={count.status} size="small" sx={{ bgcolor: getStatusColor(count.status), color: '#FFF' }} />
                    </TableCell>
                    <TableCell>
                      {count.status === 'in-progress' && (
                        <IconButton size="small" onClick={() => setCompleteDialog(count)} sx={{ color: '#4CAF50' }}>
                          <CheckCircle />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📋 Nova Contagem de Inventário
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <TextField
            fullWidth
            label="Contador"
            value={countedBy}
            onChange={(e) => setCountedBy(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observações"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
            }}
          />
          <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block', mt: 2 }}>
            💡 Após criar, adicione os produtos para contagem
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!countedBy} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Iniciar Contagem
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={!!completeDialog} onClose={() => setCompleteDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          ✅ Completar Contagem
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Completar contagem de <strong>{new Date(completeDialog?.countDate || '').toLocaleDateString()}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mt: 1 }}>
            Os ajustes serão aplicados automaticamente ao estoque.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setCompleteDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleComplete} sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}>
            Completar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryPage;
