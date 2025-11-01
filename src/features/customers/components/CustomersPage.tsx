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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../../../types';
import CustomerCard from './CustomerCard';
import CustomerDialog from './CustomerDialog';

const CustomersPage = () => {
  const { customers, loading, error, fetchCustomers, deleteCustomer, clearError } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      await deleteCustomer(customerToDelete.id);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchCustomers({ page: 1, limit: 100, search: term });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveSuccess = () => {
    fetchCustomers({ page: 1, limit: 100, search: searchTerm });
  };

  const filteredCustomers = customers;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0E6A6B', mb: 1 }}>
            Clientes
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Gerencie o cadastro de clientes (tutores) do pet shop
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
          Novo Cliente
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
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
                  {customers.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Total de Clientes
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 48, color: '#0E6A6B', opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: '#F8F5EE',
              borderLeft: '4px solid #2E7D32',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#2E7D32' }}>
                  {customers.filter((c) => c.preferences?.receivePromotions).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Aceitam Promoções
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: '#F8F5EE',
              borderLeft: '4px solid #1976D2',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#1976D2' }}>
                  {customers.filter((c) => c.preferences?.receiveReminders).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Aceitam Lembretes
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: '#F8F5EE',
              borderLeft: '4px solid #E47B24',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#E47B24' }}>
                  {customers.filter((c) => c.address).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Com Endereço
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por nome, email, telefone ou CPF..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 300 }}
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
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{
            borderColor: '#0E6A6B',
            color: '#0E6A6B',
            '&:hover': {
              borderColor: '#0E6A6B',
              bgcolor: 'rgba(14, 106, 107, 0.08)',
            },
          }}
        >
          Filtros
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && customers.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0E6A6B' }} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredCustomers.length === 0 && !searchTerm && (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#F8F5EE' }}>
          <PeopleIcon sx={{ fontSize: 80, color: '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            Nenhum cliente cadastrado
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
            Comece cadastrando o primeiro cliente do seu pet shop
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
            Cadastrar Primeiro Cliente
          </Button>
        </Paper>
      )}

      {/* No Results */}
      {!loading && filteredCustomers.length === 0 && searchTerm && (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#F8F5EE' }}>
          <SearchIcon sx={{ fontSize: 80, color: '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            Nenhum cliente encontrado
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Tente buscar por outro termo
          </Typography>
        </Paper>
      )}

      {/* Customer Cards Grid */}
      {!loading && filteredCustomers.length > 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {filteredCustomers.length} cliente{filteredCustomers.length !== 1 ? 's' : ''} encontrado
              {filteredCustomers.length !== 1 ? 's' : ''}
            </Typography>
            {searchTerm && (
              <Chip
                label={`Busca: "${searchTerm}"`}
                onDelete={() => handleSearch('')}
                size="small"
                sx={{ bgcolor: '#E47B24', color: '#FFF' }}
              />
            )}
          </Box>

          <Grid container spacing={3}>
            {filteredCustomers.map((customer) => (
              <Grid item xs={12} sm={6} md={4} key={customer.id}>
                <CustomerCard
                  customer={customer}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Customer Dialog */}
      <CustomerDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        customer={selectedCustomer}
        onSave={handleSaveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o cliente <strong>{customerToDelete?.name}</strong>?
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

export default CustomersPage;



