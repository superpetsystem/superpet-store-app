import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useSales } from '../hooks/useSales';
import { useProducts } from '../../products/hooks/useProducts';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { PaymentMethod, SaleItem } from '../../../types';
import { formatPrice, formatPaymentMethod, calculateTotal } from '../helpers/formatters';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';

const POSPage = () => {
  const { isDark } = useThemeMode();
  const { createSale, loading, error, fetchStats, clearError } = useSales();
  const { products, fetchProducts } = useProducts();
  const { customers, fetchCustomers } = useCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [discount, setDiscount] = useState(0);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchProducts({ page: 1, limit: 1000 });
    await fetchCustomers({ page: 1, limit: 1000 });
    const statsData = await fetchStats();
    setStats(statsData);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    const existingItem = cartItems.find((item) => item.productId === selectedProduct.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.productId === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unitPrice }
            : item
        )
      );
    } else {
      const newItem: SaleItem = {
        id: `${Date.now()}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        unitPrice: selectedProduct.price,
        discount: 0,
        total: quantity * selectedProduct.price,
      };
      setCartItems([...cartItems, newItem]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleFinalizeSale = async () => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal - discount;

    const saleData = {
      customerId: selectedCustomer?.id,
      items: cartItems,
      subtotal,
      discount,
      total,
      paymentMethod,
      status: 'completed' as const,
      cashierId: 'owner1',
    };

    const result = await createSale(saleData);

    if (result.success) {
      // Limpa o carrinho
      setCartItems([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setPaymentMethod('cash');
      loadData();
      alert('Venda finalizada com sucesso!');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, fontSize: typography.pageTitle }}>
          PDV - Ponto de Venda
        </Typography>
        <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.pageSubtitle }}>
          Realize vendas rápidas no balcão
        </Typography>
      </Box>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: isDark ? '#1C2128' : '#E8F5E9', borderLeft: '4px solid #4CAF50', border: isDark ? '1px solid #12888A' : 'none' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#4CAF50', fontSize: typography.cardValue }}>
                {formatPrice(stats.todayRevenue)}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.cardLabel }}>Vendas Hoje</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: isDark ? '#1C2128' : '#E3F2FD', borderLeft: '4px solid #2196F3', border: isDark ? '1px solid #12888A' : 'none' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#2196F3', fontSize: typography.cardValue }}>
                {stats.todaySales}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.cardLabel }}>Vendas</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: isDark ? '#1C2128' : '#FFF3E0', borderLeft: '4px solid #FF9800', border: isDark ? '1px solid #12888A' : 'none' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#FF9800', fontSize: typography.cardValue }}>
                {formatPrice(stats.averageTicket)}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.cardLabel }}>Ticket Médio</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: isDark ? '#1C2128' : '#F8F5EE', borderLeft: '4px solid #0E6A6B', border: isDark ? '1px solid #12888A' : 'none' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontSize: typography.cardValue }}>
                {formatPrice(stats.totalRevenue)}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.cardLabel }}>Total Faturado</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <Typography variant="h6" gutterBottom sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontSize: typography.sectionTitle }}>
              Adicionar Produtos
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => option.name}
                  value={selectedCustomer}
                  onChange={(_, newValue) => setSelectedCustomer(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Cliente (opcional)" />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={products.filter((p) => p.active && p.stock > 0)}
                  getOptionLabel={(option) => `${option.name} - ${formatPrice(option.price)}`}
                  value={selectedProduct}
                  onChange={(_, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Produto" />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props as any;
                    return (
                      <li key={key} {...otherProps}>
                        <Box>
                          <Typography variant="body2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatPrice(option.price)} | Estoque: {option.stock}
                          </Typography>
                        </Box>
                      </li>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddToCart}
                  disabled={!selectedProduct}
                  sx={{ height: 56 }}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontSize: typography.sectionTitle }}>
              Carrinho
            </Typography>

            {cartItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CartIcon sx={{ fontSize: 64, color: isDark ? '#12888A' : '#ccc', mb: 2 }} />
                <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  Carrinho vazio. Adicione produtos para iniciar a venda.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Qtd</TableCell>
                      <TableCell align="right">Preço Unit.</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatPrice(item.total)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontSize: typography.sectionTitle }}>
                Resumo da Venda
              </Typography>

              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>Subtotal:</Typography>
                  <Typography fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>{formatPrice(subtotal)}</Typography>
                </Box>

                <TextField
                  fullWidth
                  type="number"
                  label="Desconto"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>Total:</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
                    {formatPrice(total)}
                  </Typography>
                </Box>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Select
                    value={paymentMethod}
                    label="Forma de Pagamento"
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <MenuItem value="cash">💵 Dinheiro</MenuItem>
                    <MenuItem value="debit">💳 Débito</MenuItem>
                    <MenuItem value="credit">💳 Crédito</MenuItem>
                    <MenuItem value="pix">📱 PIX</MenuItem>
                    <MenuItem value="check">📝 Cheque</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<MoneyIcon />}
                  onClick={handleFinalizeSale}
                  disabled={cartItems.length === 0 || loading}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: '#F8F5EE',
                    '&:hover': { bgcolor: '#45A049' },
                    fontWeight: 'bold',
                    py: 1.5,
                    fontSize: typography.buttonLargeText,
                  }}
                >
                  Finalizar Venda
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POSPage;

