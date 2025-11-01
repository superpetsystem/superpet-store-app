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
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { Customer } from '../../../types';
import { validateCustomerForm } from '../helpers/validators';
import { formatPhone, formatCPF, formatZipCode, unformatZipCode } from '../helpers/formatters';
import { useCustomers } from '../hooks/useCustomers';

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSave: () => void;
}

const CustomerDialog = ({ open, onClose, customer, onSave }: CustomerDialogProps) => {
  const { createCustomer, updateCustomer, searchZipCode, loading } = useCustomers();
  
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    preferences: {
      contactMethod: 'whatsapp',
      receivePromotions: true,
      receiveReminders: true,
    },
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchingZip, setSearchingZip] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Preenche o formulário ao editar
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        cpf: customer.cpf || '',
        address: customer.address || {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
        preferences: customer.preferences || {
          contactMethod: 'whatsapp',
          receivePromotions: true,
          receiveReminders: true,
        },
        notes: customer.notes || '',
      });
    } else {
      // Reseta ao criar novo
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
        preferences: {
          contactMethod: 'whatsapp',
          receivePromotions: true,
          receiveReminders: true,
        },
        notes: '',
      });
    }
    setErrors({});
    setSaveError('');
  }, [customer, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    // Limpa erro do campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
    // Limpa erro do campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleSearchZipCode = async () => {
    const zipCode = formData.address.zipCode;
    if (!zipCode || zipCode.length < 8) return;

    setSearchingZip(true);
    const response = await searchZipCode(unformatZipCode(zipCode));
    setSearchingZip(false);

    if (response.success && response.data) {
      setFormData((prev: any) => ({
        ...prev,
        address: {
          ...prev.address,
          street: response.data.logradouro || prev.address.street,
          neighborhood: response.data.bairro || prev.address.neighborhood,
          city: response.data.localidade || prev.address.city,
          state: response.data.uf || prev.address.state,
        },
      }));
    }
  };

  const handleSubmit = async () => {
    // Validação
    const validation = validateCustomerForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSaveError('');

    // Salvar
    let result;
    if (customer) {
      result = await updateCustomer(customer.id, formData);
    } else {
      result = await createCustomer(formData);
    }

    if (result.success) {
      onSave();
      onClose();
    } else {
      setSaveError(result.error || 'Erro ao salvar cliente');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
            {customer ? 'Editar Cliente' : 'Novo Cliente'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B', mb: 1 }}>
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome Completo *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefone *"
              value={formData.phone}
              onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="(11) 91234-5678"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CPF"
              value={formData.cpf}
              onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
              error={!!errors.cpf}
              helperText={errors.cpf}
              placeholder="123.456.789-00"
            />
          </Grid>

          {/* Endereço */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B', mb: 1 }}>
              Endereço
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="CEP"
              value={formData.address.zipCode}
              onChange={(e) => handleAddressChange('zipCode', formatZipCode(e.target.value))}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
              placeholder="01234-567"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchZipCode} disabled={searchingZip} size="small">
                      {searchingZip ? <CircularProgress size={20} /> : <SearchIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Rua"
              value={formData.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              error={!!errors.street}
              helperText={errors.street}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Número"
              value={formData.address.number}
              onChange={(e) => handleAddressChange('number', e.target.value)}
              error={!!errors.number}
              helperText={errors.number}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Complemento"
              value={formData.address.complement}
              onChange={(e) => handleAddressChange('complement', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bairro"
              value={formData.address.neighborhood}
              onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
              error={!!errors.neighborhood}
              helperText={errors.neighborhood}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Cidade"
              value={formData.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Estado"
              value={formData.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value.toUpperCase())}
              error={!!errors.state}
              helperText={errors.state}
              inputProps={{ maxLength: 2 }}
              placeholder="SP"
            />
          </Grid>

          {/* Preferências */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B', mb: 1 }}>
              Preferências
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormLabel component="legend">Método de Contato Preferido</FormLabel>
            <RadioGroup
              row
              value={formData.preferences.contactMethod}
              onChange={(e) => handlePreferenceChange('contactMethod', e.target.value)}
            >
              <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
              <FormControlLabel value="email" control={<Radio />} label="Email" />
              <FormControlLabel value="phone" control={<Radio />} label="Telefone" />
            </RadioGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.preferences.receivePromotions}
                  onChange={(e) => handlePreferenceChange('receivePromotions', e.target.checked)}
                />
              }
              label="Receber promoções"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.preferences.receiveReminders}
                  onChange={(e) => handlePreferenceChange('receiveReminders', e.target.checked)}
                />
              }
              label="Receber lembretes"
            />
          </Grid>

          {/* Observações */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Observações adicionais sobre o cliente..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: '#E47B24',
            '&:hover': { bgcolor: '#D66B1A' },
          }}
        >
          {loading ? <CircularProgress size={24} /> : customer ? 'Salvar' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog;



