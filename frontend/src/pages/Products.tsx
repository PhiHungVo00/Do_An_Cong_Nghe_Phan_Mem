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

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  specifications: string;
  warranty: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

interface MongoProduct extends Omit<Product, 'id'> {
  _id: string;
}

interface ProductResponse {
  products: MongoProduct[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

const categories = [
  'Đồ gia dụng nhà bếp',
  'Thiết bị vệ sinh',
  'Đồ dùng phòng ngủ',
  'Đồ dùng phòng khách',
  'Thiết bị điện tử',
  'Đồ dùng văn phòng',
  'Đồ dùng phòng tắm',
  'Đồ dùng ngoài trời',
];

const brands = [
  'Samsung',
  'LG',
  'Panasonic',
  'Sharp',
  'Electrolux',
  'Sunhouse',
  'Midea',
  'Philips',
  'Toshiba',
  'Mitsubishi',
];

const validationSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên sản phẩm'),
  price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Vui lòng nhập giá'),
  stock: yup.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0').required('Vui lòng nhập số lượng'),
  category: yup.string().required('Vui lòng chọn danh mục'),
  description: yup.string().required('Vui lòng nhập mô tả'),
  brand: yup.string().required('Vui lòng chọn thương hiệu'),
  specifications: yup.string().required('Vui lòng nhập thông số kỹ thuật'),
  warranty: yup.string().required('Vui lòng nhập thời gian bảo hành'),
  sku: yup.string().required('Vui lòng nhập mã SKU'),
});

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem danh sách sản phẩm');
        return;
      }

      const response = await axios.get<ProductResponse>('http://localhost:5000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.products || !Array.isArray(response.data.products)) {
        setError('Dữ liệu sản phẩm không hợp lệ');
        return;
      }

      const productsWithIds: Product[] = response.data.products.map((product: MongoProduct) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        image: product.image,
        brand: product.brand,
        rating: product.rating,
        reviews: product.reviews,
        specifications: product.specifications,
        warranty: product.warranty,
        sku: product.sku,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }));

      setProducts(productsWithIds);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts
      });
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải danh sách sản phẩm'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải danh sách sản phẩm');
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'image', 
      headerName: 'Hình ảnh', 
      width: 100,
      renderCell: (params) => (
        <img 
          src={params.value} 
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    { field: 'name', headerName: 'Tên sản phẩm', width: 200 },
    { 
      field: 'price', 
      headerName: 'Giá', 
      width: 150,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(params.value as number);
      },
    },
    { field: 'stock', headerName: 'Tồn kho', width: 100 },
    { field: 'category', headerName: 'Danh mục', width: 150 },
    { field: 'brand', headerName: 'Thương hiệu', width: 120 },
    { field: 'rating', headerName: 'Đánh giá', width: 100 },
    { field: 'warranty', headerName: 'Bảo hành', width: 120 },
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
    setSelectedProduct(null);
    setFormData({});
    setErrors({});
    setImagePreview(null);
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setImagePreview(product.image);
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      setLoading(true);
      // Xóa sản phẩm từ server
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Cập nhật lại danh sách sản phẩm
      await fetchProducts();
      
      // Reset các state liên quan
      setSelectedProduct(null);
      setFormData({});
      setErrors({});
      setImagePreview(null);
      setError(null);

    } catch (err) {
      console.error('Error deleting product:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (err.response?.status === 404) {
          setError('Không tìm thấy sản phẩm cần xóa.');
        } else if (err.response?.status === 500) {
          setError('Lỗi server. Vui lòng thử lại sau.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa sản phẩm'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa sản phẩm');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setFormData({});
    setErrors({});
    setImagePreview(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('File phải là định dạng ảnh');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('Image converted to base64, length:', base64String.length);
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          image: base64String
        }));
      };
      reader.onerror = () => {
        setError('Lỗi khi đọc file ảnh');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      // Check for duplicate SKU in the current product list
      const isDuplicateSKU = products.some(product => 
        product.sku === formData.sku && 
        (!selectedProduct || product.id !== selectedProduct.id)
      );

      if (isDuplicateSKU) {
        setError('Mã SKU này đã tồn tại. Vui lòng chọn mã SKU khác.');
        setErrors(prev => ({
          ...prev,
          sku: 'Mã SKU này đã tồn tại'
        }));
        return;
      }

      // Validate and format data
      const formattedData = {
        name: formData.name?.trim(),
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        category: formData.category?.trim(),
        description: formData.description?.trim(),
        image: formData.image,
        brand: formData.brand?.trim(),
        rating: Number(formData.rating) || 0,
        reviews: Number(formData.reviews) || 0,
        specifications: formData.specifications?.trim(),
        warranty: formData.warranty?.trim(),
        sku: formData.sku?.trim()
      };

      // Validate required fields
      if (!formattedData.name || !formattedData.category || !formattedData.brand || !formattedData.sku) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      setLoading(true);
      if (selectedProduct) {
        // Update existing product
        console.log('Updating product with data:', formattedData);
        const response = await axios.put(
          `http://localhost:5000/api/products/${selectedProduct.id}`, 
          formattedData,
          { headers }
        );
        console.log('Update response:', response.data);
      } else {
        // Add new product
        console.log('Adding new product with data:', formattedData);
        const response = await axios.post(
          'http://localhost:5000/api/products', 
          formattedData,
          { headers }
        );
        console.log('Add response:', response.data);
      }

      // Refresh the product list after update/add
      await fetchProducts();
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
        console.error('Server error response:', err.response?.data);
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (err.response?.status === 400) {
          const errorMessage = err.response.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
          setError(errorMessage);
          // Hiển thị lỗi cụ thể cho từng trường nếu có
          if (err.response.data?.errors) {
            setErrors(err.response.data.errors);
          }
        } else if (err.response?.data?.message?.includes('duplicate key error') && err.response?.data?.message?.includes('sku')) {
          setError('Mã SKU này đã tồn tại. Vui lòng chọn mã SKU khác.');
          setErrors(prev => ({
            ...prev,
            sku: 'Mã SKU này đã tồn tại'
          }));
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

  const handleClearAllProducts = async () => {
    // Yêu cầu xác nhận kỹ lưỡng
    const confirmMessage = 'CẢNH BÁO: Thao tác này sẽ xóa TẤT CẢ sản phẩm trong cơ sở dữ liệu.\n\n' +
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
      await axios.delete('http://localhost:5000/api/products/clear-all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Cập nhật lại danh sách sản phẩm
      await fetchProducts();
      setError(null);
      alert('Đã xóa tất cả sản phẩm thành công!');
    } catch (err) {
      console.error('Error clearing products:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa sản phẩm'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa sản phẩm');
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
        <Typography variant="h4">Sản phẩm</Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleClearAllProducts}
            sx={{ mr: 2 }}
          >
            Xóa tất cả sản phẩm
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={products}
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              fullWidth
              name="sku"
              label="Mã SKU"
              value={formData.sku || ''}
              onChange={handleTextChange}
              error={!!errors.sku}
              helperText={errors.sku}
            />
            <TextField
              fullWidth
              name="name"
              label="Tên sản phẩm"
              value={formData.name || ''}
              onChange={handleTextChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              name="price"
              label="Giá (VND)"
              type="number"
              value={formData.price || ''}
              onChange={handleTextChange}
              error={!!errors.price}
              helperText={errors.price}
            />
            <TextField
              fullWidth
              name="stock"
              label="Tồn kho"
              type="number"
              value={formData.stock || ''}
              onChange={handleTextChange}
              error={!!errors.stock}
              helperText={errors.stock}
            />
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="category"
                value={formData.category || ''}
                onChange={handleSelectChange}
                label="Danh mục"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth error={!!errors.brand}>
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                name="brand"
                value={formData.brand || ''}
                onChange={handleSelectChange}
                label="Thương hiệu"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="warranty"
              label="Thời gian bảo hành"
              value={formData.warranty || ''}
              onChange={handleTextChange}
              error={!!errors.warranty}
              helperText={errors.warranty}
            />
            <Box sx={{ gridColumn: 'span 2' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Chọn ảnh sản phẩm
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              )}
            </Box>
            <TextField
              fullWidth
              name="specifications"
              label="Thông số kỹ thuật"
              multiline
              rows={2}
              value={formData.specifications || ''}
              onChange={handleTextChange}
              error={!!errors.specifications}
              helperText={errors.specifications}
            />
            <TextField
              fullWidth
              name="description"
              label="Mô tả"
              multiline
              rows={4}
              value={formData.description || ''}
              onChange={handleTextChange}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedProduct ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products; 