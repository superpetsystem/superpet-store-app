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
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { StockMovement, StockMovementType } from '../../../types';
import { validateMovementForm } from '../helpers/validators';
import { formatMovementType, getMovementTypeIcon } from '../helpers/formatters';
import { useStock } from '../hooks/useStock';
import { useProducts } from '../../products/hooks/useProducts';
import { useThemeMode } from '../../../context/ThemeContext';

interface StockMovementDialogProps {
  open: boolean;
  onClose: () => void;
  preSelectedProductId?: string;
  onSave: () => void;
}

const StockMovementDialog = ({
  open,
  onClose,
  preSelectedProductId,
  onSave,
}: StockMovementDialogProps) => {
  const { isDark } = useThemeMode();
  const { createMovement, loading } = useStock();
  const { products, fetchProducts } = useProducts();

  const [formData, setFormData] = useState<any>({
    productId: preSelectedProductId || '',
    type: 'entry' as StockMovementType,
    quantity: '',
    reason: '',
    notes: '',
    userId: 'owner1', // Mock user
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchProducts({ page: 1, limit: 1000 });
  }, [fetchProducts]);

  // Reseta formulário ao abrir/fechar
  useEffect(() => {
    if (open) {
      setFormData({
        productId: preSelectedProductId || '',
        type: 'entry' as StockMovementType,
        quantity: '',
        reason: '',
        notes: '',
        userId: 'owner1',
      });
      setErrors({});
      setSaveError('');
    }
  }, [open, preSelectedProductId]);

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
    const validationErrors = validateMovementForm({
      ...formData,
      quantity: parseFloat(formData.quantity) || 0,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepara dados para salvar
    const movementData = {
      productId: formData.productId,
      type: formData.type,
      quantity: parseFloat(formData.quantity),
      reason: formData.reason,
      notes: formData.notes || undefined,
      userId: formData.userId,
    };

    const result = await createMovement(movementData);

    if (result.success) {
      onSave();
      onClose();
    } else {
      setSaveError(result.error || 'Erro ao registrar movimentação');
    }
  };

  const movementTypes: { value: StockMovementType; label: string; description: string }[] = [
    { value: 'entry', label: '📦 Entrada', description: 'Compra de fornecedor, recebimento' },
    { value: 'exit', label: '📤 Saída', description: 'Venda, transferência' },
    { value: 'adjustment', label: '⚙️ Ajuste', description: 'Correção de inventário' },
    { value: 'return', label: '↩️ Devolução', description: 'Retorno de cliente/fornecedor' },
    { value: 'loss', label: '❌ Perda', description: 'Vencimento, dano, furto' },
  ];

  const selectedProduct = products.find((p) => p.id === formData.productId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Registrar Movimentação de Estoque</Typography>
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
          {/* Produto */}
          <Grid item xs={12}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => `${option.name} (${option.sku})`}
              value={selectedProduct || null}
              onChange={(_, newValue) => handleChange('productId', newValue?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produto *"
                  error={!!errors.productId}
                  helperText={errors.productId}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props as any;
                return (
                  <li key={key} {...otherProps}>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {option.sku} | Estoque atual: {option.stock} {option.unit}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
            />
          </Grid>

          {/* Tipo de Movimentação */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Tipo de Movimentação *</InputLabel>
              <Select
                value={formData.type}
                label="Tipo de Movimentação *"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {movementTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Typography variant="body2">{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Quantidade */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantidade *"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              error={!!errors.quantity}
              helperText={
                errors.quantity ||
                (selectedProduct
                  ? `Estoque atual: ${selectedProduct.stock} ${selectedProduct.unit}`
                  : '')
              }
              inputProps={{
                min: 0,
                step: 1,
              }}
            />
          </Grid>

          {/* Motivo */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Motivo *"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              error={!!errors.reason}
              helperText={errors.reason || 'Ex: Compra do fornecedor, Venda #123, etc'}
              multiline
              rows={2}
            />
          </Grid>

          {/* Observações */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              helperText="Informações adicionais (opcional)"
              multiline
              rows={2}
            />
          </Grid>

          {/* Preview */}
          {selectedProduct && formData.quantity && (
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Resultado da operação:</strong>
                </Typography>
                <Typography variant="body2">
                  Estoque atual: {selectedProduct.stock} {selectedProduct.unit}
                </Typography>
                <Typography variant="body2">
                  {formData.type === 'entry' || formData.type === 'return'
                    ? `Novo estoque: ${selectedProduct.stock + parseFloat(formData.quantity || 0)} ${selectedProduct.unit}`
                    : formData.type === 'exit' || formData.type === 'loss'
                    ? `Novo estoque: ${selectedProduct.stock - parseFloat(formData.quantity || 0)} ${selectedProduct.unit}`
                    : ''}
                </Typography>
              </Alert>
            </Grid>
          )}
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
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockMovementDialog;

