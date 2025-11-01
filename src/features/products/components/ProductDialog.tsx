import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Product, ProductCategory } from '../../../types';
import { validateProductForm } from '../helpers/validators';
import { formatSKU, formatBarcode, getCategoryIcon } from '../helpers/formatters';
import { useProducts } from '../hooks/useProducts';
import { useThemeMode } from '../../../context/ThemeContext';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: () => void;
}

const ProductDialog = ({ open, onClose, product, onSave }: ProductDialogProps) => {
  const { isDark } = useThemeMode();
  const { createProduct, updateProduct, loading } = useProducts();

  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    category: 'food' as ProductCategory,
    sku: '',
    barcode: '',
    price: '',
    costPrice: '',
    stock: 0,
    minStock: 0,
    unit: 'un',
    brand: '',
    supplier: '',
    expirationDate: '',
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState('');

  // Preenche o formulário ao editar
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'food',
        sku: product.sku || '',
        barcode: product.barcode || '',
        price: product.price?.toString() || '',
        costPrice: product.costPrice?.toString() || '',
        stock: product.stock ?? 0,
        minStock: product.minStock ?? 0,
        unit: product.unit || 'un',
        brand: product.brand || '',
        supplier: product.supplier || '',
        expirationDate: product.expirationDate || '',
        active: product.active ?? true,
      });
    } else {
      // Reseta ao criar novo
      setFormData({
        name: '',
        description: '',
        category: 'food' as ProductCategory,
        sku: '',
        barcode: '',
        price: '',
        costPrice: '',
        stock: 0,
        minStock: 0,
        unit: 'un',
        brand: '',
        supplier: '',
        expirationDate: '',
        active: true,
      });
    }
    setErrors({});
    setSaveError('');
  }, [product, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    // Limpa erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    setSaveError('');

    // Valida formulário
    const validationErrors = validateProductForm({
      ...formData,
      price: parseFloat(formData.price) || 0,
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepara dados para salvar
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      sku: formatSKU(formData.sku),
      barcode: formData.barcode ? formatBarcode(formData.barcode) : undefined,
      price: parseFloat(formData.price),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      stock: parseInt(formData.stock, 10) || 0,
      minStock: parseInt(formData.minStock, 10) || 0,
      unit: formData.unit,
      brand: formData.brand || undefined,
      supplier: formData.supplier || undefined,
      expirationDate: formData.expirationDate || undefined,
      photo: '',
      active: formData.active,
    };

    let result;
    if (product) {
      result = await updateProduct(product.id, productData);
    } else {
      result = await createProduct(productData);
    }

    if (result.success) {
      onSave();
      onClose();
    } else {
      setSaveError(result.error || 'Erro ao salvar produto');
    }
  };

  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'food', label: '🍖 Alimentação' },
    { value: 'toy', label: '🎾 Brinquedos' },
    { value: 'accessory', label: '🦴 Acessórios' },
    { value: 'medicine', label: '💊 Medicamentos' },
    { value: 'hygiene', label: '🧴 Higiene' },
    { value: 'other', label: '📦 Outros' },
  ];

  const units = ['un', 'kg', 'g', 'l', 'ml', 'cx', 'pct'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError('')}>
            {saveError}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Nome do Produto *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Categoria *</InputLabel>
              <Select
                value={formData.category}
                label="Categoria *"
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          {/* Identificação */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
              Identificação
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SKU *"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
              error={!!errors.sku}
              helperText={errors.sku || 'Código único do produto (ex: RAC-GOL-15KG)'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Código de Barras"
              value={formData.barcode}
              onChange={(e) => handleChange('barcode', e.target.value)}
              error={!!errors.barcode}
              helperText={errors.barcode || 'EAN-13, UPC, etc'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Marca"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fornecedor"
              value={formData.supplier}
              onChange={(e) => handleChange('supplier', e.target.value)}
            />
          </Grid>

          {/* Preços */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
              Preços
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Preço de Venda *"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              inputProps={{
                step: 0.01,
                min: 0,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Preço de Custo"
              type="number"
              value={formData.costPrice}
              onChange={(e) => handleChange('costPrice', e.target.value)}
              error={!!errors.costPrice}
              helperText={errors.costPrice || 'Para cálculo de margem'}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              inputProps={{
                step: 0.01,
                min: 0,
              }}
            />
          </Grid>

          {/* Estoque */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
              Estoque
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Quantidade em Estoque *"
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              error={!!errors.stock}
              helperText={errors.stock}
              inputProps={{
                min: 0,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Estoque Mínimo *"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleChange('minStock', e.target.value)}
              error={!!errors.minStock}
              helperText={errors.minStock || 'Para alertas'}
              inputProps={{
                min: 0,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.unit}>
              <InputLabel>Unidade *</InputLabel>
              <Select
                value={formData.unit}
                label="Unidade *"
                onChange={(e) => handleChange('unit', e.target.value)}
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Data de Validade */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Data de Validade"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleChange('expirationDate', e.target.value)}
              error={!!errors.expirationDate}
              helperText={errors.expirationDate || 'Opcional'}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" height="100%">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => handleChange('active', e.target.checked)}
                    color="primary"
                  />
                }
                label="Produto Ativo"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {product ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;

