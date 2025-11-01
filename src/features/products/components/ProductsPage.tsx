import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useProducts } from '../hooks/useProducts';
import { Product, ProductCategory } from '../../../types';
import ProductCard from './ProductCard';
import ProductDialog from './ProductDialog';
import { formatPrice, formatCategory, getCategoryIcon } from '../helpers/formatters';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';

const ProductsPage = () => {
  const { isDark } = useThemeMode();
  const {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    fetchProductStats,
    clearError,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    fetchProducts({ page: 1, limit: 1000 });
    const statsData = await fetchProductStats();
    setStats(statsData);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      loadData();
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchProducts({ page: 1, limit: 1000, search: term });
  };

  const handleCategoryFilter = (category: ProductCategory | 'all') => {
    setCategoryFilter(category);
    if (category === 'all') {
      fetchProducts({ page: 1, limit: 1000, search: searchTerm });
    } else {
      fetchProducts({ page: 1, limit: 1000, search: searchTerm, category });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveSuccess = () => {
    loadData();
  };

  const filteredProducts = products;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, fontSize: typography.pageTitle }}>
            Catálogo de Produtos
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.pageSubtitle }}>
            Gerencie produtos e serviços do pet shop
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
          Novo Produto
        </Button>
      </Box>

      {/* Stats */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                borderLeft: '4px solid #0E6A6B',
                border: isDark ? '1px solid #12888A' : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    Total de Produtos
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 48, color: isDark ? '#12888A' : '#0E6A6B', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: isDark ? '#1C2128' : '#FFF3E0',
                borderLeft: '4px solid #F57C00',
                border: isDark ? '1px solid #12888A' : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#F57C00' }}>
                    {stats.lowStock}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    Estoque Baixo
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 48, color: '#F57C00', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: isDark ? '#1C2128' : '#E8F5E9',
                borderLeft: '4px solid #2E7D32',
                border: isDark ? '1px solid #12888A' : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#2E7D32' }}>
                    {formatPrice(stats.totalValue)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    Valor em Estoque
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, color: '#2E7D32', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: isDark ? '#1C2128' : '#F3E5F5',
                borderLeft: '4px solid #7B1FA2',
                border: isDark ? '1px solid #12888A' : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#7B1FA2' }}>
                    {stats.totalCost > 0
                      ? ((stats.totalValue - stats.totalCost) / stats.totalCost * 100).toFixed(0) + '%'
                      : '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    Margem Média
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#7B1FA2', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por nome, SKU, código de barras ou marca..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Todos"
                onClick={() => handleCategoryFilter('all')}
                color={categoryFilter === 'all' ? 'primary' : 'default'}
                variant={categoryFilter === 'all' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<span>{getCategoryIcon('food')}</span>}
                label="Alimentação"
                onClick={() => handleCategoryFilter('food')}
                color={categoryFilter === 'food' ? 'primary' : 'default'}
                variant={categoryFilter === 'food' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<span>{getCategoryIcon('toy')}</span>}
                label="Brinquedos"
                onClick={() => handleCategoryFilter('toy')}
                color={categoryFilter === 'toy' ? 'primary' : 'default'}
                variant={categoryFilter === 'toy' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<span>{getCategoryIcon('accessory')}</span>}
                label="Acessórios"
                onClick={() => handleCategoryFilter('accessory')}
                color={categoryFilter === 'accessory' ? 'primary' : 'default'}
                variant={categoryFilter === 'accessory' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<span>{getCategoryIcon('medicine')}</span>}
                label="Medicamentos"
                onClick={() => handleCategoryFilter('medicine')}
                color={categoryFilter === 'medicine' ? 'primary' : 'default'}
                variant={categoryFilter === 'medicine' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<span>{getCategoryIcon('hygiene')}</span>}
                label="Higiene"
                onClick={() => handleCategoryFilter('hygiene')}
                color={categoryFilter === 'hygiene' ? 'primary' : 'default'}
                variant={categoryFilter === 'hygiene' ? 'filled' : 'outlined'}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Products Grid */}
      {!loading && (
        <>
          {filteredProducts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
              <InventoryIcon sx={{ fontSize: 64, color: isDark ? '#12888A' : '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} gutterBottom>
                Nenhum produto encontrado
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 3 }}>
                {searchTerm
                  ? 'Tente buscar com outros termos'
                  : 'Comece adicionando seu primeiro produto'}
              </Typography>
              {!searchTerm && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew} sx={{ bgcolor: '#E47B24', color: '#F8F5EE', '&:hover': { bgcolor: '#C26619' } }}>
                  Adicionar Produto
                </Button>
              )}
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Product Dialog */}
      <ProductDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        product={selectedProduct}
        onSave={handleSaveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o produto <strong>{productToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
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

export default ProductsPage;

