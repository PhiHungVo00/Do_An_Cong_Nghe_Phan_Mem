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
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as yup from 'yup';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface MongoCustomer extends Omit<Customer, 'id'> {
  _id: string;
}

interface CustomerResponse {
  customers: MongoCustomer[];
  currentPage: number;
  totalPages: number;
  totalCustomers: number;
}

const validationSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên khách hàng'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  address: yup.string().required('Vui lòng nhập địa chỉ'),
});

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem danh sách khách hàng');
        return;
      }

      const response = await axios.get<CustomerResponse>('http://localhost:5000/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.customers || !Array.isArray(response.data.customers)) {
        setError('Dữ liệu khách hàng không hợp lệ');
        return;
      }

      const customersWithIds: Customer[] = response.data.customers.map((customer: MongoCustomer) => ({
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      }));

      setCustomers(customersWithIds);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalCustomers: response.data.totalCustomers
      });
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải danh sách khách hàng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải danh sách khách hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Tên khách hàng', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 300 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Sửa
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedCustomer(null);
    setFormData({});
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      setLoading(true);
      await axios.delete(`http://localhost:5000/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await fetchCustomers();
      setSelectedCustomer(null);
      setFormData({});
      setErrors({});
      setError(null);

    } catch (err) {
      console.error('Error deleting customer:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (err.response?.status === 404) {
          setError('Không tìm thấy khách hàng cần xóa.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa khách hàng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa khách hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
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
        name: formData.name?.trim(),
        email: formData.email?.trim(),
        phone: formData.phone?.trim(),
        address: formData.address?.trim()
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      setLoading(true);
      if (selectedCustomer) {
        await axios.put(
          `http://localhost:5000/api/customers/${selectedCustomer.id}`, 
          formattedData,
          { headers }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/customers', 
          formattedData,
          { headers }
        );
      }

      await fetchCustomers();
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

  const handleClearAllCustomers = async () => {
    const confirmMessage = 'CẢNH BÁO: Thao tác này sẽ xóa TẤT CẢ khách hàng trong cơ sở dữ liệu.\n\n' +
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
      await axios.delete('http://localhost:5000/api/customers/clear-all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await fetchCustomers();
      setError(null);
      alert('Đã xóa tất cả khách hàng thành công!');
    } catch (err) {
      console.error('Error clearing customers:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa khách hàng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa khách hàng');
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
        <Typography variant="h4">Khách hàng</Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleClearAllCustomers}
            sx={{ mr: 2 }}
          >
            Xóa tất cả khách hàng
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Thêm khách hàng
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={customers}
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
          {selectedCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              name="name"
              label="Tên khách hàng"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formData.email || ''}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="phone"
              label="Số điện thoại"
              value={formData.phone || ''}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="address"
              label="Địa chỉ"
              multiline
              rows={3}
              value={formData.address || ''}
              onChange={handleInputChange}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCustomer ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers; 