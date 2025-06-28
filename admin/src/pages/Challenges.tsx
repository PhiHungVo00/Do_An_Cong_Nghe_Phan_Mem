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
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Divider,
  Stack,
  Badge,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as yup from 'yup';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Challenge {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  image?: string;
  bannerImage?: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reward: string;
  participants: string[];
  maxParticipants?: number;
  requirements: string;
  rules: string;
  createdBy?: string;
  isPublic?: boolean;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

const validationSchema = yup.object({
  title: yup.string().required('Vui lòng nhập tiêu đề thử thách'),
  description: yup.string().required('Vui lòng nhập mô tả'),
  shortDescription: yup.string(),
  image: yup.string(),
  bannerImage: yup.string(),
  startDate: yup.date().required('Vui lòng chọn ngày bắt đầu'),
  endDate: yup.date()
    .required('Vui lòng chọn ngày kết thúc')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
  type: yup.string().required('Vui lòng chọn loại thử thách'),
  status: yup.string().required('Vui lòng chọn trạng thái'),
  reward: yup.string().required('Vui lòng nhập phần thưởng'),
  participants: yup.array().of(yup.string()),
  maxParticipants: yup.number().min(0, 'Số lượng tối đa phải lớn hơn hoặc bằng 0'),
  requirements: yup.string().required('Vui lòng nhập yêu cầu'),
  rules: yup.string().required('Vui lòng nhập luật chơi'),
  isPublic: yup.boolean(),
  priority: yup.number().min(0, 'Độ ưu tiên phải lớn hơn hoặc bằng 0')
});

// Mapping functions for type and status
const typeToVi = (type: string) => {
  const typeMap: Record<string, string> = {
    'shopping': 'Mua sắm',
    'social': 'Mạng xã hội',
    'creative': 'Sáng tạo',
    'other': 'Khác'
  };
  return typeMap[type] || type;
};

const typeToEn = (type: string) => {
  const typeMap: Record<string, string> = {
    'Mua sắm': 'shopping',
    'Mạng xã hội': 'social',
    'Sáng tạo': 'creative',
    'Khác': 'other'
  };
  return typeMap[type] || type;
};

const statusToVi = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': 'Chưa bắt đầu',
    'active': 'Đang diễn ra',
    'inactive': 'Đã kết thúc',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
};

const statusToEn = (status: string) => {
  const statusMap: Record<string, string> = {
    'Chưa bắt đầu': 'draft',
    'Đang diễn ra': 'active',
    'Đã kết thúc': 'inactive',
    'Đã hủy': 'cancelled'
  };
  return statusMap[status] || status;
};

// Status color mapping
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'draft': 'default',
    'active': 'success',
    'inactive': 'error',
    'cancelled': 'warning'
  };
  return colorMap[status] || 'default';
};

// Type color mapping
const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'shopping': 'primary',
    'social': 'secondary',
    'creative': 'success',
    'other': 'info'
  };
  return colorMap[type] || 'default';
};

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState<Partial<Challenge>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        setError('Vui lòng đăng nhập để xem danh sách thử thách');
        return;
      }

      console.log('Fetching challenges from API...');
      const response = await axios.get('http://localhost:5000/api/challenges', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Challenges API response:', response.data);
      console.log('Response status:', response.status);

      // API trả về format { challenges: [...], currentPage: ..., totalPages: ..., totalChallenges: ... }
      const challengesData = response.data.challenges || [];
      console.log('Challenges data length:', challengesData.length);

      const mappedChallenges = challengesData.map((challenge: any) => ({ 
        ...challenge, 
        id: challenge._id || challenge.id,
        type: typeToVi(challenge.type),
        status: statusToVi(challenge.status)
      }));

      console.log('Mapped challenges:', mappedChallenges);
      setChallenges(mappedChallenges);
      setError(null);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải danh sách thử thách'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải danh sách thử thách');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedChallenge(null);
    setFormData({
      type: 'shopping',
      status: 'draft',
      participants: [],
      maxParticipants: 0,
      priority: 0,
      isPublic: true
    });
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setFormData({
      ...challenge,
      type: typeToEn(challenge.type),
      status: statusToEn(challenge.status)
    });
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thử thách này?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      setLoading(true);
      await axios.delete(`http://localhost:5000/api/challenges/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await fetchChallenges();
      setError(null);
      alert('Xóa thử thách thành công!');
    } catch (err) {
      console.error('Error deleting challenge:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (err.response?.status === 404) {
          setError('Không tìm thấy thử thách cần xóa.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa thử thách'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa thử thách');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedChallenge(null);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    if (errors[name as string]) {
      setErrors((prev) => ({
        ...prev,
        [name as string]: '',
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

      // Convert data to backend format
      const challengeData = {
        ...formData,
        type: typeToEn(formData.type || 'shopping'),
        status: statusToEn(formData.status || 'draft'),
        startDate: formData.startDate,
        endDate: formData.endDate,
        participants: formData.participants || [],
        maxParticipants: Number(formData.maxParticipants) || 0,
        priority: Number(formData.priority) || 0,
        isPublic: formData.isPublic !== undefined ? formData.isPublic : true
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      setLoading(true);
      if (selectedChallenge) {
        await axios.put(
          `http://localhost:5000/api/challenges/${selectedChallenge.id}`, 
          challengeData,
          { headers }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/challenges', 
          challengeData,
          { headers }
        );
      }

      await fetchChallenges();
      handleClose();
      setError(null);
      // Hiển thị thông báo thành công
      if (selectedChallenge) {
        alert('Cập nhật thử thách thành công!');
      } else {
        alert('Thêm thử thách thành công!');
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

  const columns: GridColDef[] = [
    { 
      field: 'image', 
      headerName: 'Hình ảnh', 
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={
            params.value?.startsWith('/assets/')
              ? `http://localhost:5000${params.value}`
              : params.value
          }
          alt={params.row.title}
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    { 
      field: 'title', 
      headerName: 'Tiêu đề', 
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {params.value}
          </Typography>
          {params.row.shortDescription && (
            <Typography variant="caption" color="text.secondary">
              {params.row.shortDescription}
            </Typography>
          )}
        </Box>
      ),
    },
    { 
      field: 'type', 
      headerName: 'Loại', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getTypeColor(typeToEn(params.value)) as any}
          size="small"
        />
      ),
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(statusToEn(params.value)) as any}
          size="small"
        />
      ),
    },
    { 
      field: 'reward', 
      headerName: 'Phần thưởng', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EmojiEventsIcon sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    { 
      field: 'startDate', 
      headerName: 'Ngày bắt đầu', 
      width: 120,
      valueFormatter: (params) => {
        return format(new Date(params.value), 'dd/MM/yyyy', { locale: vi });
      },
    },
    { 
      field: 'endDate', 
      headerName: 'Ngày kết thúc', 
      width: 120,
      valueFormatter: (params) => {
        return format(new Date(params.value), 'dd/MM/yyyy', { locale: vi });
      },
    },
    { 
      field: 'participants', 
      headerName: 'Người tham gia', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupIcon sx={{ fontSize: 16, mr: 0.5, color: 'info.main' }} />
          <Typography variant="body2">
            {params.value ? params.value.length : 0}
            {params.row.maxParticipants && ` / ${params.row.maxParticipants}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              color="info"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Statistics
  const stats = {
    total: challenges.length,
    active: challenges.filter(c => statusToEn(c.status) === 'active').length,
    draft: challenges.filter(c => statusToEn(c.status) === 'draft').length,
    completed: challenges.filter(c => statusToEn(c.status) === 'inactive').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Quản lý Thử thách
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tạo và quản lý các thử thách cho người dùng tham gia
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2">
                    Tổng thử thách
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.active}
                  </Typography>
                  <Typography variant="body2">
                    Đang diễn ra
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.draft}
                  </Typography>
                  <Typography variant="body2">
                    Chưa bắt đầu
                  </Typography>
                </Box>
                <EmojiEventsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2">
                    Đã kết thúc
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Danh sách Thử thách
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hiển thị {challenges.length} thử thách
            </Typography>
          </Box>
          <Box>
            <Button 
              variant="outlined" 
              onClick={fetchChallenges} 
              sx={{ mr: 1 }}
              startIcon={<TrendingUpIcon />}
            >
              Làm mới
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAdd}
              startIcon={<AddIcon />}
            >
              Thêm thử thách
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Data Grid */}
      {challenges.length > 0 ? (
        <Paper sx={{ height: 600 }}>
          <DataGrid
            rows={challenges}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 }
              }
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none'
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: 'action.hover'
              }
            }}
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EmojiEventsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {loading ? 'Đang tải danh sách thử thách...' : 'Chưa có thử thách nào'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {loading ? 'Vui lòng chờ trong giây lát...' : 'Bắt đầu tạo thử thách đầu tiên của bạn'}
          </Typography>
          {!loading && (
            <Button 
              variant="contained" 
              onClick={handleAdd}
              startIcon={<AddIcon />}
            >
              Tạo thử thách đầu tiên
            </Button>
          )}
        </Paper>
      )}

      {/* Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ mr: 1 }} />
            {selectedChallenge ? 'Chỉnh sửa thử thách' : 'Thêm thử thách mới'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="title"
                label="Tiêu đề thử thách"
                value={formData.title || ''}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="reward"
                label="Phần thưởng"
                value={formData.reward || ''}
                onChange={handleInputChange}
                error={!!errors.reward}
                helperText={errors.reward}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="startDate"
                label="Ngày bắt đầu"
                type="date"
                value={formData.startDate || ''}
                onChange={handleInputChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="endDate"
                label="Ngày kết thúc"
                type="date"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.type} variant="outlined">
                <InputLabel>Loại thử thách</InputLabel>
                <Select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleInputChange}
                  label="Loại thử thách"
                >
                  <MenuItem value="shopping">Mua sắm</MenuItem>
                  <MenuItem value="social">Mạng xã hội</MenuItem>
                  <MenuItem value="creative">Sáng tạo</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.status} variant="outlined">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  label="Trạng thái"
                >
                  <MenuItem value="draft">Chưa bắt đầu</MenuItem>
                  <MenuItem value="active">Đang diễn ra</MenuItem>
                  <MenuItem value="inactive">Đã kết thúc</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="maxParticipants"
                label="Số lượng tối đa"
                type="number"
                value={formData.maxParticipants || ''}
                onChange={handleInputChange}
                error={!!errors.maxParticipants}
                helperText={errors.maxParticipants}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="priority"
                label="Độ ưu tiên"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.priority || ''}
                onChange={handleInputChange}
                error={!!errors.priority}
                helperText={errors.priority}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="image"
                label="URL hình ảnh"
                value={formData.image || ''}
                onChange={handleInputChange}
                error={!!errors.image}
                helperText={errors.image}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="bannerImage"
                label="URL banner"
                value={formData.bannerImage || ''}
                onChange={handleInputChange}
                error={!!errors.bannerImage}
                helperText={errors.bannerImage}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="shortDescription"
                label="Mô tả ngắn"
                multiline
                rows={2}
                value={formData.shortDescription || ''}
                onChange={handleInputChange}
                error={!!errors.shortDescription}
                helperText={errors.shortDescription}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Mô tả"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="requirements"
                label="Yêu cầu"
                multiline
                rows={3}
                value={formData.requirements || ''}
                onChange={handleInputChange}
                error={!!errors.requirements}
                helperText={errors.requirements}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="rules"
                label="Luật chơi"
                multiline
                rows={3}
                value={formData.rules || ''}
                onChange={handleInputChange}
                error={!!errors.rules}
                helperText={errors.rules}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined" size="large">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" size="large">
            {selectedChallenge ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Challenges;