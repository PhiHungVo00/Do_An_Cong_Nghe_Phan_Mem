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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as yup from 'yup';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  soldCount?: number;
  category: string;
  description: string;
  image: string;
  images?: string[];
  brand: string;
  rating: number;
  reviewCount: number;
  specifications: string;
  warranty: string;
  sku: string;
  supplier?: string;
  barcode?: string;
  tags?: string[];
  isActive?: boolean;
  featured?: boolean;
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
  originalPrice: yup.number().min(0, 'Giá gốc phải lớn hơn hoặc bằng 0'),
  discount: yup.number().min(0, 'Giảm giá phải lớn hơn hoặc bằng 0').max(100, 'Giảm giá không được vượt quá 100%'),
  stock: yup.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0').required('Vui lòng nhập số lượng'),
  soldCount: yup.number().min(0, 'Số lượng đã bán phải lớn hơn hoặc bằng 0'),
  category: yup.string().required('Vui lòng chọn danh mục'),
  description: yup.string().required('Vui lòng nhập mô tả'),
  image: yup.string().required('Vui lòng nhập đường dẫn hình ảnh'),
  brand: yup.string().required('Vui lòng chọn thương hiệu'),
  rating: yup.number().min(0, 'Đánh giá phải lớn hơn hoặc bằng 0').max(5, 'Đánh giá không được vượt quá 5'),
  reviewCount: yup.number().min(0, 'Số đánh giá phải lớn hơn hoặc bằng 0'),
  specifications: yup.string().required('Vui lòng nhập thông số kỹ thuật'),
  warranty: yup.string().required('Vui lòng nhập thời gian bảo hành'),
  sku: yup.string().required('Vui lòng nhập mã SKU'),
  supplier: yup.string(),
  barcode: yup.string(),
  isActive: yup.boolean(),
  featured: yup.boolean()
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
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    fetchProducts(paginationModel.page);
    // eslint-disable-next-line
  }, [paginationModel.page]);

  const fetchProducts = async (page = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem danh sách sản phẩm');
        return;
      }

      const response = await axios.get<ProductResponse>(`http://localhost:5000/api/products?page=${page + 1}`, {
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
        originalPrice: product.originalPrice,
        discount: product.discount,
        stock: product.stock,
        soldCount: product.soldCount,
        category: product.category,
        description: product.description,
        image: product.image,
        images: product.images,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviewCount,
        specifications: product.specifications,
        warranty: product.warranty,
        sku: product.sku,
        supplier: product.supplier,
        barcode: product.barcode,
        tags: product.tags,
        isActive: product.isActive,
        featured: product.featured,
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
          src={
            params.value?.startsWith('/assets/')
              ? `http://localhost:5000${params.value}`
              : params.value
          }
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    { field: 'name', headerName: 'Tên sản phẩm', width: 200 },
    { field: 'sku', headerName: 'SKU', width: 120 },
    { 
      field: 'price', 
      headerName: 'Giá', 
      width: 120,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(params.value as number);
      },
    },
    { 
      field: 'originalPrice', 
      headerName: 'Giá gốc', 
      width: 120,
      valueFormatter: (params) => {
        return params.value ? new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(params.value as number) : '-';
      },
    },
    { 
      field: 'discount', 
      headerName: 'Giảm giá', 
      width: 100,
      valueFormatter: (params) => {
        return params.value ? `${params.value}%` : '-';
      },
    },
    { field: 'stock', headerName: 'Tồn kho', width: 100 },
    { field: 'soldCount', headerName: 'Đã bán', width: 100 },
    { field: 'category', headerName: 'Danh mục', width: 150 },
    { field: 'brand', headerName: 'Thương hiệu', width: 120 },
    { 
      field: 'rating', 
      headerName: 'Đánh giá', 
      width: 100,
      valueFormatter: (params) => {
        return params.value ? `${params.value}/5` : '-';
      },
    },
    { field: 'reviewCount', headerName: 'Số đánh giá', width: 120 },
    { field: 'warranty', headerName: 'Bảo hành', width: 120 },
    { 
      field: 'isActive', 
      headerName: 'Trạng thái', 
      width: 100,
      renderCell: (params) => (
        <Box sx={{ 
          color: params.value ? 'success.main' : 'error.main',
          fontWeight: 'bold'
        }}>
          {params.value ? 'Hoạt động' : 'Không hoạt động'}
        </Box>
      ),
    },
    { 
      field: 'featured', 
      headerName: 'Nổi bật', 
      width: 100,
      renderCell: (params) => (
        <Box sx={{ 
          color: params.value ? 'primary.main' : 'text.secondary',
          fontWeight: 'bold'
        }}>
          {params.value ? 'Có' : 'Không'}
        </Box>
      ),
    },
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

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      image: value
    }));
    setImagePreview(value);
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
        product.sku === formData.sku?.trim() && 
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
        originalPrice: Number(formData.originalPrice) || 0,
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock) || 0,
        soldCount: Number(formData.soldCount) || 0,
        category: formData.category?.trim(),
        description: formData.description?.trim(),
        image: formData.image,
        images: formData.images || [],
        brand: formData.brand?.trim(),
        rating: Number(formData.rating) || 0,
        reviewCount: Number(formData.reviewCount) || 0,
        specifications: formData.specifications?.trim(),
        warranty: formData.warranty?.trim(),
        sku: formData.sku?.trim(),
        supplier: formData.supplier?.trim(),
        barcode: formData.barcode?.trim(),
        tags: formData.tags || [],
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        featured: formData.featured !== undefined ? formData.featured : false
      };

      // Validate required fields
      if (!formattedData.name || !formattedData.category || !formattedData.brand || !formattedData.sku || !formattedData.image) {
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
      // Hiển thị thông báo thành công
      if (selectedProduct) {
        alert('Cập nhật sản phẩm thành công!');
      } else {
        alert('Thêm sản phẩm thành công!');
      }
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
        setError('Vui lòng kiểm tra lại thông tin đã nhập');
        return;
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
          } else if (err.response.data?.message) {
            // Nếu có lỗi validation cụ thể, hiển thị trong form
            const errorMessage = err.response.data.message;
            if (errorMessage.includes('name')) {
              setErrors(prev => ({ ...prev, name: 'Tên sản phẩm không hợp lệ' }));
            }
            if (errorMessage.includes('price')) {
              setErrors(prev => ({ ...prev, price: 'Giá không hợp lệ' }));
            }
            if (errorMessage.includes('stock')) {
              setErrors(prev => ({ ...prev, stock: 'Số lượng không hợp lệ' }));
            }
            if (errorMessage.includes('sku')) {
              setErrors(prev => ({ ...prev, sku: 'Mã SKU không hợp lệ' }));
            }
            if (errorMessage.includes('image')) {
              setErrors(prev => ({ ...prev, image: 'Hình ảnh không hợp lệ' }));
            }
          }
        } else if (err.response?.status === 409) {
          setError('Mã SKU này đã tồn tại. Vui lòng chọn mã SKU khác.');
          setErrors(prev => ({
            ...prev,
            sku: 'Mã SKU này đã tồn tại'
          }));
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
              paginationModel: { pageSize: 10, page: 0 }
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
          pagination
          paginationMode="server"
          rowCount={pagination.totalProducts}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
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
              name="originalPrice"
              label="Giá gốc (VND)"
              type="number"
              value={formData.originalPrice || ''}
              onChange={handleTextChange}
              error={!!errors.originalPrice}
              helperText={errors.originalPrice}
            />
            <TextField
              fullWidth
              name="discount"
              label="Giảm giá (%)"
              type="number"
              value={formData.discount || ''}
              onChange={handleTextChange}
              error={!!errors.discount}
              helperText={errors.discount}
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
            <TextField
              fullWidth
              name="soldCount"
              label="Đã bán"
              type="number"
              value={formData.soldCount || ''}
              onChange={handleTextChange}
              error={!!errors.soldCount}
              helperText={errors.soldCount}
            />
            <TextField
              fullWidth
              name="rating"
              label="Đánh giá (0-5)"
              type="number"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              value={formData.rating || ''}
              onChange={handleTextChange}
              error={!!errors.rating}
              helperText={errors.rating}
            />
            <TextField
              fullWidth
              name="reviewCount"
              label="Số đánh giá"
              type="number"
              value={formData.reviewCount || ''}
              onChange={handleTextChange}
              error={!!errors.reviewCount}
              helperText={errors.reviewCount}
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
              <TextField
                fullWidth
                name="image"
                label="Hoặc nhập URL ảnh"
                value={formData.image || ''}
                onChange={handleImageUrlChange}
                error={!!errors.image}
                helperText={errors.image}
                sx={{ mb: 2 }}
              />
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
            <TextField
              fullWidth
              name="supplier"
              label="Nhà cung cấp"
              value={formData.supplier || ''}
              onChange={handleTextChange}
              error={!!errors.supplier}
              helperText={errors.supplier}
            />
            <TextField
              fullWidth
              name="barcode"
              label="Mã vạch"
              value={formData.barcode || ''}
              onChange={handleTextChange}
              error={!!errors.barcode}
              helperText={errors.barcode}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={formData.isActive === true}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked
                  }))}
                />
              }
              label="Hoạt động"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="featured"
                  checked={formData.featured === true}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked
                  }))}
                />
              }
              label="Nổi bật"
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