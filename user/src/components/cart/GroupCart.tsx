import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Delete,
  Share,
  PersonAdd,
  Edit,
} from '@mui/icons-material';
import { Cart as CartType, CartMember } from '../../types';

interface GroupCartProps {
  cart: CartType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
  onShareCart: () => void;
  onAddMember: (email: string, role: CartMember['role']) => void;
  onRemoveMember: (userId: string) => void;
  onUpdateMemberRole: (userId: string, role: CartMember['role']) => void;
  currentUserId: string;
}

const GroupCart: React.FC<GroupCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveProduct,
  onShareCart,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  currentUserId,
}) => {
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<CartMember['role']>('viewer');

  const currentUserRole = cart.members.find(m => m.userId === currentUserId)?.role;
  const canEdit = currentUserRole === 'owner' || currentUserRole === 'editor';
  const canManageMembers = currentUserRole === 'owner';

  const subtotal = cart.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const handleAddMember = () => {
    onAddMember(newMemberEmail, newMemberRole);
    setIsAddMemberDialogOpen(false);
    setNewMemberEmail('');
    setNewMemberRole('viewer');
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {cart.name}
          </Typography>
          <Box>
            {canManageMembers && (
              <IconButton onClick={() => setIsAddMemberDialogOpen(true)}>
                <PersonAdd />
              </IconButton>
            )}
            <IconButton onClick={onShareCart}>
              <Share />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {cart.products.map((product) => (
                <Grid item xs={12} key={product.id}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.price.toLocaleString('vi-VN')}đ
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TextField
                          type="number"
                          size="small"
                          value={product.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0) {
                              onUpdateQuantity(product.id, value);
                            }
                          }}
                          disabled={!canEdit}
                          sx={{ width: 80 }}
                        />
                        {canEdit && (
                          <IconButton
                            color="error"
                            onClick={() => onRemoveProduct(product.id)}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="subtitle1">
                      {(product.price * product.quantity).toLocaleString('vi-VN')}đ
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="h6">
                Tổng cộng: {subtotal.toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Thành viên
            </Typography>
            <List>
              {cart.members.map((member) => (
                <ListItem key={member.userId}>
                  <ListItemText
                    primary={member.userId}
                    secondary={`Vai trò: ${member.role}`}
                  />
                  {canManageMembers && member.userId !== currentUserId && (
                    <ListItemSecondaryAction>
                      <Select
                        size="small"
                        value={member.role}
                        onChange={(e) =>
                          onUpdateMemberRole(member.userId, e.target.value as CartMember['role'])
                        }
                        sx={{ mr: 1, minWidth: 100 }}
                      >
                        <MenuItem value="viewer">Người xem</MenuItem>
                        <MenuItem value="editor">Người sửa</MenuItem>
                      </Select>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => onRemoveMember(member.userId)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog
        open={isAddMemberDialogOpen}
        onClose={() => setIsAddMemberDialogOpen(false)}
      >
        <DialogTitle>Thêm thành viên</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as CartMember['role'])}
                label="Vai trò"
              >
                <MenuItem value="viewer">Người xem</MenuItem>
                <MenuItem value="editor">Người sửa</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddMemberDialogOpen(false)}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={!newMemberEmail}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default GroupCart; 