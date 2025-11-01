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
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Customer } from '../../../types';
import { formatPhone, formatFullAddress, getInitials } from '../helpers/formatters';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onViewDetails?: (customer: Customer) => void;
}

const CustomerCard = ({ customer, onEdit, onDelete, onViewDetails }: CustomerCardProps) => {
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
    onEdit(customer);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(customer);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(customer);
    }
  };

  const getContactMethodIcon = () => {
    switch (customer.preferences?.contactMethod) {
      case 'whatsapp':
        return <WhatsAppIcon sx={{ fontSize: 16 }} />;
      case 'email':
        return <EmailIcon sx={{ fontSize: 16 }} />;
      case 'phone':
        return <PhoneIcon sx={{ fontSize: 16 }} />;
      default:
        return <PhoneIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Card
      sx={{
        bgcolor: '#F8F5EE',
        border: '1px solid #E0E0E0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: onViewDetails ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: '#E47B24',
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
                bgcolor: '#E47B24',
                width: 56,
                height: 56,
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
              src={customer.avatar}
            >
              {getInitials(customer.name)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                {customer.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                {getContactMethodIcon()}
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {customer.preferences?.contactMethod || 'whatsapp'}
                </Typography>
              </Box>
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

        {/* Informações de Contato */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PhoneIcon sx={{ color: '#E47B24', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#1E1E1E' }}>
              {formatPhone(customer.phone)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <EmailIcon sx={{ color: '#E47B24', fontSize: 18 }} />
            <Typography
              variant="body2"
              sx={{
                color: '#1E1E1E',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {customer.email}
            </Typography>
          </Box>
          {customer.address && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationIcon sx={{ color: '#E47B24', fontSize: 18, mt: 0.2 }} />
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {formatFullAddress(customer.address)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tags e Badges */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {customer.preferences?.receivePromotions && (
            <Chip
              label="Promoções"
              size="small"
              sx={{
                bgcolor: '#E8F5E9',
                color: '#2E7D32',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
          {customer.preferences?.receiveReminders && (
            <Chip
              label="Lembretes"
              size="small"
              sx={{
                bgcolor: '#E3F2FD',
                color: '#1976D2',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
          {customer.notes && (
            <Chip
              label="Com observações"
              size="small"
              icon={<PetsIcon sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: '#FFF3E0',
                color: '#E65100',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;



