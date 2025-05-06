import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, IconButton, Box, Typography, Button } from '@mui/material';
import { Close, Remove, Add, Delete } from '@mui/icons-material';

const Cart = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Tu Carrito</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {items.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
            Tu carrito está vacío
          </Typography>
        ) : (
          <>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`$${item.price} x ${item.quantity}`} 
                  />
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography mx={1}>{item.quantity}</Typography>
                    <IconButton onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Add fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onRemove(item.id)} sx={{ ml: 1 }}>
                      <Delete color="error" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="h6" gutterBottom>
                Total: ${total.toFixed(2)}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Proceder al Pago
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cart;