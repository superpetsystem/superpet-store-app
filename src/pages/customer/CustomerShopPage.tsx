import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Delete,
  Close,
  LocalShipping,
  CreditCard,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { productsApi } from '../../features/products/api/productsApi';
import { cartApi } from '../../features/ecommerce/api/cartApi';
import { Product, Cart, CartItem } from '../../types';

const CustomerShopPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Checkout form
  const [paymentMethod, setPaymentMethod] = useState('pix');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    const [productsRes, cartRes] = await Promise.all([
      productsApi.getProducts({ page: 1, limit: 1000 }),
      cartApi.getCart(user.id),
    ]);

    if (productsRes.success && productsRes.data) setProducts(productsRes.data.data || []);
    if (cartRes.success && cartRes.data) setCart(cartRes.data);
    setLoading(false);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) return;

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
    };

    const response = await cartApi.addItem(user.id, cartItem);
    if (response.success && response.data) {
      setCart(response.data);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    const response = await cartApi.updateItem(user.id, productId, quantity);
    if (response.success && response.data) {
      setCart(response.data);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!user) return;

    const response = await cartApi.removeItem(user.id, productId);
    if (response.success && response.data) {
      setCart(response.data);
    }
  };

  const handleCheckout = async () => {
    if (!user || !cart) return;

    const shippingAddress = {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    };

    const response = await cartApi.checkout(user.id, user.name, shippingAddress, paymentMethod);

    if (response.success && response.data) {
      setCart(null);
      setCheckoutDialog(false);
      setCartDrawerOpen(false);
      alert('🎉 Pedido realizado com sucesso! Acompanhe em "Meus Pedidos"');
      loadData(); // Recarregar
    }
  };

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
            🛒 Loja Online
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Compre produtos para seu pet com entrega em casa
          </Typography>
        </Box>
        <IconButton
          onClick={() => setCartDrawerOpen(true)}
          sx={{
            bgcolor: '#E47B24',
            color: '#FFF',
            '&:hover': { bgcolor: '#C26619' },
            width: 56,
            height: 56,
          }}
        >
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Box>

      {/* Filters */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', mb: 3 }}>
        <CardContent>
          <TextField
            select
            label="Categoria"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
              },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
              '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
            }}
          >
            <MenuItem value="all">Todas as Categorias</MenuItem>
            <MenuItem value="food">Ração</MenuItem>
            <MenuItem value="toys">Brinquedos</MenuItem>
            <MenuItem value="hygiene">Higiene</MenuItem>
            <MenuItem value="accessories">Acessórios</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <Typography>Carregando produtos...</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                  border: isDark ? '1px solid #12888A' : 'none',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: '#E0E0E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                  }}
                >
                  {product.category === 'food' ? '🍖' : product.category === 'toys' ? '🎾' : product.category === 'hygiene' ? '🧼' : '🎒'}
                </CardMedia>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 2, flexGrow: 1 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#E47B24' }}>
                      R$ {product.price.toFixed(2)}
                    </Typography>
                    <Chip
                      label={product.stock > 0 ? `Estoque: ${product.stock}` : 'Esgotado'}
                      size="small"
                      sx={{
                        bgcolor: product.stock > 0 ? '#4CAF50' : '#F44336',
                        color: '#FFF',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    disabled={product.stock === 0}
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      bgcolor: '#E47B24',
                      color: '#FFF',
                      '&:hover': { bgcolor: '#C26619' },
                      '&:disabled': { bgcolor: '#CCC', color: '#666' },
                    }}
                  >
                    {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: isDark ? '#0D1117' : '#F8F5EE',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
              🛒 Meu Carrinho
            </Typography>
            <IconButton onClick={() => setCartDrawerOpen(false)}>
              <Close sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }} />
            </IconButton>
          </Box>

          {!cart || cart.items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingCart sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
              <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                Seu carrinho está vazio
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                {cart.items.map((item, index) => (
                  <React.Fragment key={item.productId}>
                    <ListItem sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                        <Typography variant="body1" fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                          {item.productName}
                        </Typography>
                        <IconButton size="small" onClick={() => handleRemoveItem(item.productId)}>
                          <Delete sx={{ color: '#F44336' }} />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>
                            <Remove />
                          </IconButton>
                          <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= item.stock}>
                            <Add />
                          </IconButton>
                        </Box>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: '#E47B24' }}>
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < cart.items.length - 1 && <Divider sx={{ my: 1, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 3, p: 2, bgcolor: isDark ? '#1C2128' : '#FFFFFF', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>Subtotal:</Typography>
                  <Typography fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                    R$ {cart.subtotal.toFixed(2)}
                  </Typography>
                </Box>
                {cart.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>Desconto:</Typography>
                    <Typography fontWeight="600" sx={{ color: '#4CAF50' }}>
                      -R$ {cart.discount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    <LocalShipping sx={{ verticalAlign: 'middle', fontSize: 18, mr: 0.5 }} />
                    Frete:
                  </Typography>
                  <Typography fontWeight="600" sx={{ color: cart.shipping === 0 ? '#4CAF50' : isDark ? '#F8F5EE' : '#0E6A6B' }}>
                    {cart.shipping === 0 ? 'GRÁTIS' : `R$ ${cart.shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#E47B24' }}>
                    R$ {cart.total.toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<CreditCard />}
                  onClick={() => setCheckoutDialog(true)}
                  sx={{
                    bgcolor: '#E47B24',
                    color: '#FFF',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': { bgcolor: '#C26619' },
                  }}
                >
                  Finalizar Compra
                </Button>
                {cart.subtotal < 200 && (
                  <Typography variant="caption" sx={{ color: isDark ? '#12888A' : '#999', display: 'block', textAlign: 'center', mt: 1 }}>
                    Frete grátis para compras acima de R$ 200,00
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialog} onClose={() => setCheckoutDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          💳 Finalizar Compra
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>Forma de Pagamento</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Forma de Pagamento"
              sx={{
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              }}
            >
              <MenuItem value="pix">PIX (Aprovação Instantânea)</MenuItem>
              <MenuItem value="credit-card">Cartão de Crédito</MenuItem>
              <MenuItem value="boleto">Boleto (Aprovação em 1-2 dias)</MenuItem>
            </Select>
          </FormControl>

          {cart && (
            <Box sx={{ p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 2 }}>
                Resumo do Pedido
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>Subtotal:</Typography>
                <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>R$ {cart.subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>Frete:</Typography>
                <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                  {cart.shipping === 0 ? 'GRÁTIS' : `R$ ${cart.shipping.toFixed(2)}`}
                </Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#E47B24' }}>
                  R$ {cart.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setCheckoutDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCheckout}
            sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
          >
            Confirmar Pedido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerShopPage;
