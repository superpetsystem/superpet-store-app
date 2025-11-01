import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FemaleOutlined as FemaleIcon,
  MaleOutlined as MaleIcon,
  Loyalty as MicrochipIcon,
  Warning as WarningIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Pet } from '../../../types';
import {
  formatSpecies,
  formatSize,
  formatAge,
  formatWeight,
  formatNeutered,
  getSpeciesIcon,
  getSpeciesColor,
  getInitials,
} from '../helpers/formatters';

interface PetCardProps {
  pet: Pet;
  customerName?: string;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
  onViewDetails?: (pet: Pet) => void;
}

const PetCard = ({ pet, customerName, onEdit, onDelete, onViewDetails }: PetCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(pet);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(pet);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(pet);
    }
  };

  const speciesColor = getSpeciesColor(pet.species);

  return (
    <Card
      sx={{
        bgcolor: '#F8F5EE',
        border: '2px solid',
        borderColor: speciesColor,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: onViewDetails ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        {/* Header com Avatar e Menu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Avatar
              sx={{
                bgcolor: speciesColor,
                width: 56,
                height: 56,
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
              src={pet.photo}
            >
              {pet.photo ? getInitials(pet.name) : getSpeciesIcon(pet.species)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    color: '#0E6A6B',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pet.name}
                </Typography>
                {pet.gender === 'male' ? (
                  <MaleIcon sx={{ color: '#2196F3', fontSize: 20 }} />
                ) : (
                  <FemaleIcon sx={{ color: '#E91E63', fontSize: 20 }} />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {formatSpecies(pet.species)}
                {pet.breed && ` • ${pet.breed}`}
              </Typography>
              {customerName && (
                <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                  Tutor: {customerName}
                </Typography>
              )}
            </Box>
          </Box>

          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText sx={{ color: '#D32F2F' }}>Excluir</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        {/* Informações */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              label={formatAge(pet.age, pet.birthDate)}
              size="small"
              sx={{ bgcolor: '#E3F2FD', color: '#1976D2', fontWeight: 600 }}
            />
            {pet.weight && (
              <Chip
                label={formatWeight(pet.weight)}
                size="small"
                sx={{ bgcolor: '#F3E5F5', color: '#7B1FA2', fontWeight: 600 }}
              />
            )}
            {pet.size && (
              <Chip
                label={formatSize(pet.size)}
                size="small"
                sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 600 }}
              />
            )}
          </Box>

          {pet.color && (
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Cor: {pet.color}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
            Castrado: {formatNeutered(pet.neutered)}
          </Typography>
        </Box>

        {/* Badges de Saúde */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {pet.microchip && (
            <Tooltip title={`Microchip: ${pet.microchip}`}>
              <Chip
                icon={<MicrochipIcon sx={{ fontSize: 16 }} />}
                label="Microchip"
                size="small"
                sx={{
                  bgcolor: '#E8F5E9',
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Tooltip>
          )}
          {pet.allergies && pet.allergies.length > 0 && (
            <Tooltip title={`Alergias: ${pet.allergies.join(', ')}`}>
              <Chip
                icon={<WarningIcon sx={{ fontSize: 16 }} />}
                label={`${pet.allergies.length} ${pet.allergies.length === 1 ? 'Alergia' : 'Alergias'}`}
                size="small"
                sx={{
                  bgcolor: '#FFEBEE',
                  color: '#C62828',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Tooltip>
          )}
          {pet.medications && pet.medications.length > 0 && (
            <Tooltip title={`Medicações: ${pet.medications.join(', ')}`}>
              <Chip
                icon={<MedicalIcon sx={{ fontSize: 16 }} />}
                label={`${pet.medications.length} ${pet.medications.length === 1 ? 'Medicação' : 'Medicações'}`}
                size="small"
                sx={{
                  bgcolor: '#E1F5FE',
                  color: '#0277BD',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Tooltip>
          )}
        </Box>

        {/* Notas */}
        {pet.notes && (
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontStyle: 'italic',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            "{pet.notes}"
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PetCard;



