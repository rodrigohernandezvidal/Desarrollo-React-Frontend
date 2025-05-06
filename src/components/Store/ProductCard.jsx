import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={`$${product.price}`} 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              padding: '4px 8px'
            }} 
          />
          <Typography variant="caption" color="text.secondary">
            Disponible
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          endIcon={<AddShoppingCart />}
          onClick={() => onAddToCart(product)}
          sx={{
            backgroundColor: '#FF2D55',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#d82548'
            }
          }}
        >
          Añadir al carrito
        </Button>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default ProductCard;