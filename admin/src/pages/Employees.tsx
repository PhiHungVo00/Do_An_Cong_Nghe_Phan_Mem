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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as yup from 'yup';
import axios from 'axios';

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
}

const validationSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên nhân viên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  position: yup.string().required('Vui lòng nhập chức vụ'),
  department: yup.string().required('Vui lòng nhập phòng ban'),
});

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Tên nhân viên', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'position', headerName: 'Chức vụ', width: 150 },
    { field: 'department', headerName: 'Phòng ban', width: 150 },
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
            onClick={() => handleDelete(params.row._id)}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setFormData({});
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData(employee);
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
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
      if (selectedEmployee) {
        // Update existing employee
        await axios.put(`http://localhost:5000/api/employees/${selectedEmployee._id}`, formData);
      } else {
        // Add new employee
        await axios.post('http://localhost:5000/api/employees', formData);
      }
      fetchEmployees();
      handleClose();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Nhân viên</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Thêm nhân viên
        </Button>
      </Box>

      <DataGrid
        rows={employees}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 }
          }
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        autoHeight
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              name="name"
              label="Tên nhân viên"
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
              name="position"
              label="Chức vụ"
              value={formData.position || ''}
              onChange={handleInputChange}
              error={!!errors.position}
              helperText={errors.position}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="department"
              label="Phòng ban"
              value={formData.department || ''}
              onChange={handleInputChange}
              error={!!errors.department}
              helperText={errors.department}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedEmployee ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees; 