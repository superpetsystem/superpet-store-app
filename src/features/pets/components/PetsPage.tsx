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
  Pets as PetsIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { usePets } from '../hooks/usePets';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { Pet, PetSpecies } from '../../../types';
import PetCard from './PetCard';
import PetDialog from './PetDialog';
import { formatSpecies } from '../helpers/formatters';

interface PetsPageProps {
  customerId?: string; // Se fornecido, mostra apenas pets deste cliente
}

const PetsPage = ({ customerId }: PetsPageProps) => {
  const { pets, loading, error, fetchPets, fetchPetsByCustomer, deletePet, clearError } = usePets();
  const { customers, fetchCustomers } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<PetSpecies | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchPetsByCustomer(customerId);
    } else {
      fetchPets();
    }
    fetchCustomers({ page: 1, limit: 1000 });
  }, [customerId, fetchPets, fetchPetsByCustomer, fetchCustomers]);

  const handleAddNew = () => {
    setSelectedPet(null);
    setDialogOpen(true);
  };

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setDialogOpen(true);
  };

  const handleDeleteClick = (pet: Pet) => {
    setPetToDelete(pet);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (petToDelete) {
      await deletePet(petToDelete.id);
      setDeleteDialogOpen(false);
      setPetToDelete(null);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPet(null);
  };

  const handleSaveSuccess = () => {
    if (customerId) {
      fetchPetsByCustomer(customerId);
    } else {
      fetchPets({ page: 1, limit: 1000, search: searchTerm });
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name;
  };

  // Filtros
  const filteredPets = pets.filter((pet) => {
    // Filtro de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed?.toLowerCase().includes(searchLower) ||
        pet.microchip?.includes(searchTerm) ||
        getCustomerName(pet.customerId)?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro de espécie
    if (speciesFilter !== 'all' && pet.species !== speciesFilter) {
      return false;
    }

    return true;
  });

  // Estatísticas
  const stats = {
    total: pets.length,
    dogs: pets.filter((p) => p.species === 'dog').length,
    cats: pets.filter((p) => p.species === 'cat').length,
    others: pets.filter((p) => !['dog', 'cat'].includes(p.species)).length,
    neutered: pets.filter((p) => p.neutered).length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0E6A6B', mb: 1 }}>
            {customerId ? 'Pets do Cliente' : 'Pets'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Gerencie o cadastro de pets dos clientes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{
            bgcolor: '#E47B24',
            '&:hover': { bgcolor: '#D66B1A' },
            fontWeight: 'bold',
          }}
        >
          Novo Pet
        </Button>
      </Box>

      {/* Stats */}
      {!customerId && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, bgcolor: '#F8F5EE', borderLeft: '4px solid #E47B24' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#E47B24' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total de Pets
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, bgcolor: '#F8F5EE', borderLeft: '4px solid #FF9800' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF9800' }}>
                {stats.dogs}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Cachorros
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, bgcolor: '#F8F5EE', borderLeft: '4px solid #9C27B0' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                {stats.cats}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Gatos
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, bgcolor: '#F8F5EE', borderLeft: '4px solid #2E7D32' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#2E7D32' }}>
                {stats.neutered}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Castrados
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por nome, raça, microchip ou tutor..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#0E6A6B' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: '#F8F5EE',
                  '& fieldset': { borderColor: '#0E6A6B' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ToggleButtonGroup
              value={speciesFilter}
              exclusive
              onChange={(_, value) => value && setSpeciesFilter(value)}
              aria-label="filtro de espécie"
              sx={{ width: '100%', display: 'flex' }}
            >
              <ToggleButton value="all" sx={{ flex: 1 }}>
                Todos
              </ToggleButton>
              <ToggleButton value="dog" sx={{ flex: 1 }}>
                🐕 Cachorros
              </ToggleButton>
              <ToggleButton value="cat" sx={{ flex: 1 }}>
                🐈 Gatos
              </ToggleButton>
              <ToggleButton value="other" sx={{ flex: 1 }}>
                🐾 Outros
              </ToggleButton>
            </ToggleButtonGroup>
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
      {loading && pets.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0E6A6B' }} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredPets.length === 0 && !searchTerm && speciesFilter === 'all' && (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#F8F5EE' }}>
          <PetsIcon sx={{ fontSize: 80, color: '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            Nenhum pet cadastrado
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
            Comece cadastrando o primeiro pet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              bgcolor: '#E47B24',
              '&:hover': { bgcolor: '#D66B1A' },
            }}
          >
            Cadastrar Primeiro Pet
          </Button>
        </Paper>
      )}

      {/* No Results */}
      {!loading && filteredPets.length === 0 && (searchTerm || speciesFilter !== 'all') && (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#F8F5EE' }}>
          <SearchIcon sx={{ fontSize: 80, color: '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            Nenhum pet encontrado
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
            Tente buscar por outro termo ou ajustar os filtros
          </Typography>
          {(searchTerm || speciesFilter !== 'all') && (
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSpeciesFilter('all');
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </Paper>
      )}

      {/* Pet Cards Grid */}
      {!loading && filteredPets.length > 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} encontrado
              {filteredPets.length !== 1 ? 's' : ''}
            </Typography>
            {searchTerm && (
              <Chip
                label={`Busca: "${searchTerm}"`}
                onDelete={() => handleSearch('')}
                size="small"
                sx={{ bgcolor: '#E47B24', color: '#FFF' }}
              />
            )}
            {speciesFilter !== 'all' && (
              <Chip
                label={`Espécie: ${formatSpecies(speciesFilter)}`}
                onDelete={() => setSpeciesFilter('all')}
                size="small"
                sx={{ bgcolor: '#0E6A6B', color: '#FFF' }}
              />
            )}
          </Box>

          <Grid container spacing={3}>
            {filteredPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} key={pet.id}>
                <PetCard
                  pet={pet}
                  customerName={!customerId ? getCustomerName(pet.customerId) : undefined}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Pet Dialog */}
      <PetDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        pet={selectedPet}
        preSelectedCustomerId={customerId}
        onSave={handleSaveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o pet <strong>{petToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#D32F2F', mt: 2 }}>
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

export default PetsPage;



