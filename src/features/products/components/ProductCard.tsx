import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as StockIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Product } from '../../../types';
import {
  formatPrice,
  formatCategory,
  formatStockStatus,
  formatExpirationDate,
  formatMargin,
  getCategoryIcon,
  getCategoryColor,
} from '../helpers/formatters';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(product);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(product);
  };

  const stockStatus = formatStockStatus(product.stock, product.minStock);
  const expirationStatus = formatExpirationDate(product.expirationDate);
  const margin = formatMargin(product.price, product.costPrice);
  const categoryColor = getCategoryColor(product.category);
  const categoryIcon = getCategoryIcon(product.category);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: product.active ? 1 : 0.6,
        border: stockStatus.status === 'out' ? '2px solid #f44336' : 'none',
      }}
    >
      {/* Badge de categoria */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: categoryColor,
          color: 'white',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: 2,
        }}
      >
        {categoryIcon}
      </Box>

      {/* Menu de ações */}
      <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
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
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 6 }}>
        {/* Nome do produto */}
        <Tooltip title={product.name}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3.5rem',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {product.name}
          </Typography>
        </Tooltip>

        {/* Descrição */}
        {product.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              minHeight: '2.5rem',
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* SKU e Categoria */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            SKU: <strong>{product.sku}</strong>
          </Typography>
          <Chip
            label={formatCategory(product.category)}
            size="small"
            sx={{
              mt: 0.5,
              backgroundColor: categoryColor,
              color: 'white',
              fontWeight: 500,
            }}
          />
        </Box>

        {/* Preço */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
          {product.costPrice && (
            <Typography variant="caption" color="text.secondary">
              Custo: {formatPrice(product.costPrice)} | Margem: {margin}
            </Typography>
          )}
        </Box>

        {/* Status de Estoque */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <StockIcon fontSize="small" color={stockStatus.color as any} />
          <Typography variant="body2" fontWeight={500}>
            Estoque: {product.stock} {product.unit}
          </Typography>
        </Box>

        <Chip
          label={stockStatus.label}
          size="small"
          color={stockStatus.color as any}
          icon={
            stockStatus.status === 'ok' ? (
              <CheckIcon />
            ) : stockStatus.status === 'low' ? (
              <WarningIcon />
            ) : (
              <BlockIcon />
            )
          }
        />

        {/* Marca e Fornecedor */}
        {(product.brand || product.supplier) && (
          <Box sx={{ mt: 2 }}>
            {product.brand && (
              <Typography variant="caption" color="text.secondary" display="block">
                Marca: {product.brand}
              </Typography>
            )}
            {product.supplier && (
              <Typography variant="caption" color="text.secondary" display="block">
                Fornecedor: {product.supplier}
              </Typography>
            )}
          </Box>
        )}

        {/* Data de Validade */}
        {product.expirationDate && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Validade: ${expirationStatus.formatted}`}
              size="small"
              color={expirationStatus.color as any}
              variant={expirationStatus.status !== 'ok' ? 'filled' : 'outlined'}
              icon={
                expirationStatus.status === 'expired' ? (
                  <BlockIcon />
                ) : expirationStatus.status === 'warning' ? (
                  <WarningIcon />
                ) : (
                  <CheckIcon />
                )
              }
            />
          </Box>
        )}

        {/* Status Ativo/Inativo */}
        {!product.active && (
          <Box sx={{ mt: 2 }}>
            <Chip label="Inativo" size="small" color="default" variant="outlined" />
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Mín: {product.minStock} {product.unit}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {product.stock > product.minStock
            ? `${product.stock - product.minStock} acima do mínimo`
            : product.stock === product.minStock
            ? 'No mínimo'
            : 'Abaixo do mínimo'}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default ProductCard;

