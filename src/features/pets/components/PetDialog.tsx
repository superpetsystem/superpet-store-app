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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Autocomplete,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { Pet, PetSpecies, PetGender, PetSize } from '../../../types';
import { validatePetForm } from '../helpers/validators';
import { calculateAge } from '../helpers/formatters';
import { usePets } from '../hooks/usePets';
import { useCustomers } from '../../customers/hooks/useCustomers';

interface PetDialogProps {
  open: boolean;
  onClose: () => void;
  pet?: Pet | null;
  preSelectedCustomerId?: string;
  onSave: () => void;
}

const PetDialog = ({ open, onClose, pet, preSelectedCustomerId, onSave }: PetDialogProps) => {
  const { createPet, updatePet, loading } = usePets();
  const { customers, fetchCustomers } = useCustomers();

  const [formData, setFormData] = useState<any>({
    customerId: preSelectedCustomerId || '',
    name: '',
    species: 'dog' as PetSpecies,
    breed: '',
    gender: 'male' as PetGender,
    birthDate: '',
    age: undefined,
    weight: undefined,
    size: undefined,
    color: '',
    microchip: '',
    neutered: false,
    allergies: [],
    medications: [],
    specialCare: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    fetchCustomers({ page: 1, limit: 1000 });
  }, [fetchCustomers]);

  // Preenche o formulário ao editar
  useEffect(() => {
    if (pet) {
      setFormData({
        customerId: pet.customerId,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '',
        gender: pet.gender,
        birthDate: pet.birthDate || '',
        age: pet.age,
        weight: pet.weight,
        size: pet.size,
        color: pet.color || '',
        microchip: pet.microchip || '',
        neutered: pet.neutered || false,
        allergies: pet.allergies || [],
        medications: pet.medications || [],
        specialCare: pet.specialCare || '',
        notes: pet.notes || '',
      });
    } else {
      setFormData({
        customerId: preSelectedCustomerId || '',
        name: '',
        species: 'dog' as PetSpecies,
        breed: '',
        gender: 'male' as PetGender,
        birthDate: '',
        age: undefined,
        weight: undefined,
        size: undefined,
        color: '',
        microchip: '',
        neutered: false,
        allergies: [],
        medications: [],
        specialCare: '',
        notes: '',
      });
    }
    setErrors({});
    setSaveError('');
    setNewAllergy('');
    setNewMedication('');
  }, [pet, preSelectedCustomerId, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };
      
      // Se birthDate mudou, recalcula idade
      if (field === 'birthDate' && value) {
        updated.age = calculateAge(value);
      }
      
      return updated;
    });

    // Limpa erro do campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      allergies: prev.allergies.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()],
      }));
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      medications: prev.medications.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    // Validação
    const validation = validatePetForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSaveError('');

    // Preparar dados
    const dataToSave = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
    };

    // Salvar
    let result;
    if (pet) {
      result = await updatePet(pet.id, dataToSave);
    } else {
      result = await createPet(dataToSave);
    }

    if (result.success) {
      onSave();
      onClose();
    } else {
      setSaveError(result.error || 'Erro ao salvar pet');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
            {pet ? 'Editar Pet' : 'Novo Pet'}
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
          {/* Cliente */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B', mb: 1 }}>
              Tutor
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={customers}
              getOptionLabel={(option) => `${option.name} - ${option.email}`}
              value={customers.find((c) => c.id === formData.customerId) || null}
              onChange={(_, newValue) => handleChange('customerId', newValue?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente (Tutor) *"
                  error={!!errors.customerId}
                  helperText={errors.customerId}
                />
              )}
              noOptionsText="Nenhum cliente encontrado"
            />
          </Grid>

          {/* Informações Básicas */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B', mb: 1 }}>
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome do Pet *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.species}>
              <InputLabel>Espécie *</InputLabel>
              <Select
                value={formData.species}
                label="Espécie *"
                onChange={(e) => handleChange('species', e.target.value)}
              >
                <MenuItem value="dog">🐕 Cachorro</MenuItem>
                <MenuItem value="cat">🐈 Gato</MenuItem>
                <MenuItem value="bird">🐦 Pássaro</MenuItem>
                <MenuItem value="rabbit">🐰 Coelho</MenuItem>
                <MenuItem value="hamster">🐹 Hamster</MenuItem>
                <MenuItem value="other">🐾 Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Raça"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Sexo *</InputLabel>
              <Select
                value={formData.gender}
                label="Sexo *"
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <MenuItem value="male">Macho</MenuItem>
                <MenuItem value="female">Fêmea</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Características Físicas */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B', mb: 1 }}>
              Características Físicas
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data de Nascimento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.birthDate}
              helperText={errors.birthDate || (formData.birthDate && formData.age ? `${formData.age} anos` : '')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Peso (kg)"
              type="number"
              value={formData.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
              error={!!errors.weight}
              helperText={errors.weight}
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Porte</InputLabel>
              <Select
                value={formData.size || ''}
                label="Porte"
                onChange={(e) => handleChange('size', e.target.value)}
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                <MenuItem value="small">Pequeno</MenuItem>
                <MenuItem value="medium">Médio</MenuItem>
                <MenuItem value="large">Grande</MenuItem>
                <MenuItem value="extra-large">Extra Grande</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cor/Pelagem"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Microchip"
              value={formData.microchip}
              onChange={(e) => handleChange('microchip', e.target.value)}
              error={!!errors.microchip}
              helperText={errors.microchip || '15 dígitos'}
              inputProps={{ maxLength: 15 }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.neutered}
                  onChange={(e) => handleChange('neutered', e.target.checked)}
                />
              }
              label="Castrado"
            />
          </Grid>

          {/* Saúde */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B', mb: 1 }}>
              Saúde
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Alergias
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Adicionar alergia"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddAllergy}
                  sx={{ minWidth: 120 }}
                >
                  Adicionar
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.allergies.map((allergy: string, index: number) => (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={() => handleRemoveAllergy(index)}
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Medicações
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Adicionar medicação"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddMedication}
                  sx={{ minWidth: 120 }}
                >
                  Adicionar
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.medications.map((medication: string, index: number) => (
                  <Chip
                    key={index}
                    label={medication}
                    onDelete={() => handleRemoveMedication(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cuidados Especiais"
              multiline
              rows={2}
              value={formData.specialCare}
              onChange={(e) => handleChange('specialCare', e.target.value)}
              placeholder="Ex: Precisa de exercícios diários, evitar alimentos quentes..."
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
              placeholder="Observações adicionais sobre o pet..."
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
          {loading ? <CircularProgress size={24} /> : pet ? 'Salvar' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PetDialog;

