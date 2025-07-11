import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as yup from 'yup';
import axios from 'axios';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string; // Thêm dòng này
  shippingAddress: string;
  items?: Array<{
    productId: string;
    productName?: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface MongoOrder extends Omit<Order, 'id'> {
  _id: string;
}

interface OrderResponse {
  orders: MongoOrder[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

const validationSchema = yup.object({
  orderNumber: yup.string().required('Vui lòng nhập mã đơn hàng'),
  customer: yup.string().required('Vui lòng nhập tên khách hàng'),
  date: yup.string().required('Vui lòng nhập ngày đặt hàng'),
  totalAmount: yup.number().min(0, 'Tổng tiền phải lớn hơn hoặc bằng 0').required('Vui lòng nhập tổng tiền'),
  status: yup.string().required('Vui lòng chọn trạng thái đơn hàng'),
  paymentStatus: yup.string().required('Vui lòng chọn trạng thái thanh toán'),
  shippingAddress: yup.string().required('Vui lòng nhập địa chỉ giao hàng'),
});

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem danh sách đơn hàng');
        return;
      }

      const response = await axios.get<OrderResponse>('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.orders || !Array.isArray(response.data.orders)) {
        setError('Dữ liệu đơn hàng không hợp lệ');
        return;
      }

      const ordersWithIds: Order[] = response.data.orders.map((order: MongoOrder) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        date: order.date,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod, // Thêm dòng này
        shippingAddress: order.shippingAddress,
        items: order.items,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));

      setOrders(ordersWithIds);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalOrders: response.data.totalOrders
      });
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải danh sách đơn hàng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải danh sách đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'orderNumber', headerName: 'Mã đơn hàng', width: 130 },
    { field: 'customer', headerName: 'Khách hàng', width: 200 },
    { field: 'date', headerName: 'Ngày đặt', width: 130 },
    { 
      field: 'totalAmount', 
      headerName: 'Tổng tiền', 
      width: 150,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(params.value as number);
      },
    },
    { field: 'status', headerName: 'Trạng thái', width: 130 },
    { field: 'paymentStatus', headerName: 'Thanh toán', width: 130 },
    { 
      field: 'items', 
      headerName: 'Sản phẩm', 
      width: 200,
      renderCell: (params) => {
        const items = params.value || [];
        if (items.length === 0) return 'Không có sản phẩm';
        
        return (
          <Box>
            {items.slice(0, 2).map((item: any, index: number) => (
              <Typography key={index} variant="caption" display="block">
                {item.productName || `SP ${item.productId.slice(-6)}`} x{item.quantity}
              </Typography>
            ))}
            {items.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{items.length - 2} sản phẩm khác
              </Typography>
            )}
          </Box>
        );
      }
    },
    { field: 'shippingAddress', headerName: 'Địa chỉ giao hàng', width: 300 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={() => handleConfirmOrder(params.row.id)}
            disabled={params.row.status !== 'Đang xử lý' || isActionLoading}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Xác nhận
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => handleUpdatePaymentStatus(params.row.id, 'Đã thanh toán')}
            disabled={params.row.paymentStatus === 'Đã thanh toán' || isActionLoading}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Đã TT
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleCancelOrder(params.row.id)}
            disabled={params.row.status === 'Đã hủy' || isActionLoading}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Hủy
          </Button>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}
            disabled={isActionLoading}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Sửa
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            disabled={isActionLoading}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedOrder(null);
    setFormData({});
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setFormData(order);
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      setIsActionLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        setIsActionLoading(false);
        return;
      }

      setLoading(true);
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await fetchOrders();
      setSelectedOrder(null);
      setFormData({});
      setErrors({});
      setError(null);

    } catch (err) {
      console.error('Error deleting order:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (err.response?.status === 404) {
          setError('Không tìm thấy đơn hàng cần xóa.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa đơn hàng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa đơn hàng');
      }
    } finally {
      setLoading(false);
      setIsActionLoading(false);
    }
  };

  // Thao tác nhanh: Xác nhận đơn hàng
  const handleConfirmOrder = async (id: string) => {
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        setIsActionLoading(false);
        return;
      }

      const order = orders.find(o => o.id === id);
      if (!order) return;
      // Chỉ xác nhận nếu đơn đang ở trạng thái 'Đang xử lý'
      if (order.status !== 'Đang xử lý') {
        setError('Chỉ có thể xác nhận đơn ở trạng thái Đang xử lý');
        setIsActionLoading(false);
        return;
      }
      // Xác định trạng thái thanh toán theo phương thức
      let paymentStatus = order.paymentStatus;
      if (order.paymentMethod === 'COD') {
        paymentStatus = 'Chờ thanh toán';
      } else if (order.paymentMethod === 'Chuyển khoản') {
        paymentStatus = 'Đã thanh toán';
      }
      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        ...order,
        status: 'Đã hoàn thành',
        paymentStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchOrders();
      setError(null);
    } catch (err) {
      console.error('Error confirming order:', err);
      if (axios.isAxiosError(err)) {
        setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xác nhận đơn hàng'}`);
      } else {
        setError('Có lỗi xảy ra khi xác nhận đơn hàng');
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  // Thao tác nhanh: Hủy đơn hàng
  const handleCancelOrder = async (id: string) => {
    setIsActionLoading(true);
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      setIsActionLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        setIsActionLoading(false);
        return;
      }

      const order = orders.find(o => o.id === id);
      if (!order) return;

      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        ...order,
        status: 'Đã hủy'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchOrders();
      setError(null);
    } catch (err) {
      console.error('Error canceling order:', err);
      if (axios.isAxiosError(err)) {
        setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể hủy đơn hàng'}`);
      } else {
        setError('Có lỗi xảy ra khi hủy đơn hàng');
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  // Thao tác nhanh: Cập nhật trạng thái thanh toán
  const handleUpdatePaymentStatus = async (id: string, paymentStatus: string) => {
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        setIsActionLoading(false);
        return;
      }

      const order = orders.find(o => o.id === id);
      if (!order) return;

      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        ...order,
        paymentStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchOrders();
      setError(null);
    } catch (err) {
      console.error('Error updating payment status:', err);
      if (axios.isAxiosError(err)) {
        setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể cập nhật trạng thái thanh toán'}`);
      } else {
        setError('Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
    if (errors[name as string]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      const formattedData = {
        orderNumber: formData.orderNumber?.trim(),
        customer: formData.customer?.trim(),
        date: formData.date?.trim(),
        totalAmount: Number(formData.totalAmount) || 0,
        status: formData.status?.trim(),
        paymentStatus: formData.paymentStatus?.trim(),
        shippingAddress: formData.shippingAddress?.trim()
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      setLoading(true);
      if (selectedOrder) {
        await axios.put(
          `http://localhost:5000/api/orders/${selectedOrder.id}`, 
          formattedData,
          { headers }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/orders', 
          formattedData,
          { headers }
        );
      }

      await fetchOrders();
      handleClose();
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      } else if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (err.response?.status === 400) {
          const errorMessage = err.response.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
          setError(errorMessage);
          if (err.response.data?.errors) {
            setErrors(err.response.data.errors);
          }
        } else {
          setError(`Lỗi server: ${err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'}`);
        }
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllOrders = async () => {
    const confirmMessage = 'CẢNH BÁO: Thao tác này sẽ xóa TẤT CẢ đơn hàng trong cơ sở dữ liệu.\n\n' +
      'Điều này không thể hoàn tác.\n\n' +
      'Để xác nhận, vui lòng nhập "DELETE ALL" vào ô bên dưới:';
    
    const userInput = window.prompt(confirmMessage);
    
    if (userInput !== 'DELETE ALL') {
      setError('Thao tác đã bị hủy do xác nhận không đúng.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      setLoading(true);
      await axios.delete('http://localhost:5000/api/orders/clear-all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await fetchOrders();
      setError(null);
      alert('Đã xóa tất cả đơn hàng thành công!');
    } catch (err) {
      console.error('Error clearing orders:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa đơn hàng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Đơn hàng</Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleClearAllOrders}
            sx={{ mr: 2 }}
          >
            Xóa tất cả đơn hàng
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Thêm đơn hàng
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 }
            }
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            }
          }}
        />
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              name="orderNumber"
              label="Mã đơn hàng"
              value={formData.orderNumber || ''}
              onChange={handleInputChange}
              error={!!errors.orderNumber}
              helperText={errors.orderNumber}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="customer"
              label="Khách hàng"
              value={formData.customer || ''}
              onChange={handleInputChange}
              error={!!errors.customer}
              helperText={errors.customer}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="date"
              label="Ngày đặt"
              type="date"
              value={formData.date || ''}
              onChange={handleInputChange}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="totalAmount"
              label="Tổng tiền (VND)"
              type="number"
              value={formData.totalAmount || ''}
              onChange={handleInputChange}
              error={!!errors.totalAmount}
              helperText={errors.totalAmount}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Trạng thái đơn hàng</InputLabel>
              <Select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                error={!!errors.status}
                label="Trạng thái đơn hàng"
              >
                <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
                <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                <MenuItem value="Đã hủy">Đã hủy</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Trạng thái thanh toán</InputLabel>
              <Select
                name="paymentStatus"
                value={formData.paymentStatus || ''}
                onChange={handleInputChange}
                error={!!errors.paymentStatus}
                label="Trạng thái thanh toán"
              >
                <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                <MenuItem value="Chờ thanh toán">Chờ thanh toán</MenuItem>
                <MenuItem value="Đã hoàn tiền">Đã hoàn tiền</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="shippingAddress"
              label="Địa chỉ giao hàng"
              multiline
              rows={3}
              value={formData.shippingAddress || ''}
              onChange={handleInputChange}
              error={!!errors.shippingAddress}
              helperText={errors.shippingAddress}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedOrder ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders; 