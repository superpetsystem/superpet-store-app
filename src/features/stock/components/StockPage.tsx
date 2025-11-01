import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useStock } from '../hooks/useStock';
import { useProducts } from '../../products/hooks/useProducts';
import { StockMovement } from '../../../types';
import StockMovementDialog from './StockMovementDialog';
import { useThemeMode } from '../../../context/ThemeContext';
import {
  formatMovementType,
  formatDateTime,
  formatQuantityWithSign,
  getMovementTypeColor,
  getMovementTypeIcon,
} from '../helpers/formatters';
import { typography } from '../../../theme/typography';

const StockPage = () => {
  const { isDark } = useThemeMode();
  const {
    movements,
    loading,
    error,
    fetchMovements,
    deleteMovement,
    fetchMovementStats,
    clearError,
  } = useStock();

  const { products, fetchProducts } = useProducts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movementToDelete, setMovementToDelete] = useState<StockMovement | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchMovements({ page: 1, limit: 1000 });
    await fetchProducts({ page: 1, limit: 1000 });
    const statsData = await fetchMovementStats();
    setStats(statsData);
  };

  const handleAddNew = () => {
    setDialogOpen(true);
  };

  const handleDeleteClick = (movement: StockMovement) => {
    setMovementToDelete(movement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (movementToDelete) {
      await deleteMovement(movementToDelete.id);
      setDeleteDialogOpen(false);
      setMovementToDelete(null);
      loadData();
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSaveSuccess = () => {
    loadData();
  };

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      fetchMovements({ page: 1, limit: 1000 });
    } else {
      const types = ['entry', 'exit', 'adjustment', 'return', 'loss'];
      fetchMovements({ page: 1, limit: 1000, type: types[newValue - 1] });
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  const getProductSKU = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.sku : '-';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, fontSize: typography.pageTitle }}>
            Controle de Estoque
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.pageSubtitle }}>
            Registre e acompanhe movimentações de estoque
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            '&:hover': { bgcolor: '#C26619' },
            fontWeight: 'bold',
            fontSize: typography.buttonText,
          }}
        >
          Nova Movimentação
        </Button>
      </Box>

      {/* Stats */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: '#E8F5E9',
                borderLeft: '4px solid #4CAF50',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                    {stats.totalEntry}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total de Entradas
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#4CAF50', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: '#E3F2FD',
                borderLeft: '4px solid #2196F3',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#2196F3' }}>
                    {stats.totalExit}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total de Saídas
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 48, color: '#2196F3', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: '#FFEBEE',
                borderLeft: '4px solid #F44336',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#F44336' }}>
                    {stats.totalLoss}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total de Perdas
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 48, color: '#F44336', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: '#F8F5EE',
                borderLeft: '4px solid #0E6A6B',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total de Movimentações
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 48, color: '#0E6A6B', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable">
          <Tab label="Todas" />
          <Tab label="📦 Entradas" />
          <Tab label="📤 Saídas" />
          <Tab label="⚙️ Ajustes" />
          <Tab label="↩️ Devoluções" />
          <Tab label="❌ Perdas" />
        </Tabs>
      </Paper>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Movements Table */}
      {!loading && (
        <>
          {movements.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#F8F5EE' }}>
              <InventoryIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma movimentação encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comece registrando sua primeira movimentação de estoque
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
                Registrar Movimentação
              </Button>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8F5EE' }}>
                    <TableCell><strong>Data/Hora</strong></TableCell>
                    <TableCell><strong>Produto</strong></TableCell>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell align="right"><strong>Quantidade</strong></TableCell>
                    <TableCell><strong>Motivo</strong></TableCell>
                    <TableCell><strong>Observações</strong></TableCell>
                    <TableCell align="center"><strong>Ações</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(movement.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {getProductName(movement.productId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SKU: {getProductSKU(movement.productId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatMovementType(movement.type)}
                          size="small"
                          sx={{
                            bgcolor: getMovementTypeColor(movement.type),
                            color: 'white',
                            fontWeight: 500,
                          }}
                          icon={<span>{getMovementTypeIcon(movement.type)}</span>}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            color:
                              movement.type === 'entry' || movement.type === 'return'
                                ? '#4CAF50'
                                : '#F44336',
                          }}
                        >
                          {formatQuantityWithSign(movement.quantity, movement.type)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{movement.reason}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {movement.notes || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(movement)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Movement Dialog */}
      <StockMovementDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta movimentação?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita e pode afetar o estoque do produto.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockPage;

