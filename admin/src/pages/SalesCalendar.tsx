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
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import axios from 'axios';
import * as yup from 'yup';
import { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import { blue, grey } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';

interface SalesEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  location: string;
  participants: string[];
  budget: number;
  notes: string;
  shortDescription?: string;
  image?: string;
  bannerImage?: string;
  maxParticipants?: number;
  products?: string[];
  discountPercentage?: number;
  isPublic?: boolean;
  priority?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

const validationSchema = yup.object({
  title: yup.string().required('Vui lòng nhập tiêu đề sự kiện'),
  description: yup.string(),
  shortDescription: yup.string(),
  image: yup.string(),
  bannerImage: yup.string(),
  startDate: yup.date().required('Vui lòng chọn ngày bắt đầu'),
  endDate: yup.date()
    .required('Vui lòng chọn ngày kết thúc')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
  type: yup.string().required('Vui lòng chọn loại sự kiện'),
  status: yup.string().required('Vui lòng chọn trạng thái'),
  location: yup.string(),
  participants: yup.array().of(yup.string()),
  maxParticipants: yup.number().min(0, 'Số lượng tối đa phải lớn hơn hoặc bằng 0'),
  budget: yup.number().min(0, 'Ngân sách phải lớn hơn hoặc bằng 0'),
  notes: yup.string(),
  products: yup.array().of(yup.string()),
  discountPercentage: yup.number().min(0, 'Phần trăm giảm giá phải lớn hơn hoặc bằng 0').max(100, 'Phần trăm giảm giá không được vượt quá 100%'),
  isPublic: yup.boolean(),
  priority: yup.number().min(0, 'Độ ưu tiên phải lớn hơn hoặc bằng 0')
});

const CustomDatePicker: React.FC<{
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  sx?: any;
}> = ({ label, value, onChange, sx }) => {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      sx={sx}
    />
  );
};

const EVENT_COLORS: Record<string, {bg: string, color: string}> = {
  'promotion': { bg: '#E1EAF8', color: '#1A237E' },
  'event': { bg: '#B2DFDB', color: '#00695C' },
  'meeting': { bg: '#FFF9C4', color: '#F57C00' },
  'other': { bg: '#E0E0E0', color: '#424242' },
};

// Mapping functions for type and status
const typeToVi = (type: string) => {
  const typeMap: Record<string, string> = {
    'promotion': 'Khuyến mãi',
    'event': 'Sự kiện',
    'meeting': 'Họp',
    'other': 'Khác'
  };
  return typeMap[type] || type;
};

const typeToEn = (type: string) => {
  const typeMap: Record<string, string> = {
    'Khuyến mãi': 'promotion',
    'Sự kiện': 'event',
    'Họp': 'meeting',
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

const getEventBoxStyle = (type: string) => {
  const c = EVENT_COLORS[type] || EVENT_COLORS['other'];
  return {
    background: c.bg,
    color: c.color,
    borderRadius: 8,
    padding: '4px 8px',
    margin: '4px 0',
    fontWeight: 500,
    fontSize: 13,
    boxShadow: 'none',
    border: '1px solid #bdbdbd',
    textAlign: 'left',
    cursor: 'pointer',
    minHeight: 28,
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Chưa bắt đầu':
      return '#757575';
    case 'Đang diễn ra':
      return '#4CAF50';
    case 'Đã kết thúc':
      return '#2196F3';
    case 'Đã hủy':
      return '#F44336';
    default:
      return '#757575';
  }
};

const SalesCalendar: React.FC = () => {
  const [events, setEvents] = useState<SalesEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SalesEvent | null>(null);
  const [formData, setFormData] = useState<Partial<SalesEvent>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem lịch sự kiện');
        return;
      }

      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const response = await axios.get(`http://localhost:5000/api/sales-events/range?start=${start}&end=${end}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const mappedEvents = Array.isArray(response.data)
        ? response.data.map((event: any) => ({ 
            ...event, 
            id: event._id,
            type: typeToVi(event.type),
            status: statusToVi(event.status)
          }))
        : [];
      setEvents(mappedEvents);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải danh sách sự kiện'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải danh sách sự kiện');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEvent(null);
    setFormData({
      type: 'promotion',
      status: 'draft',
      participants: [],
      budget: 0
    });
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (event: SalesEvent) => {
    setSelectedEvent(event);
    setFormData({
      ...event,
      type: typeToEn(event.type),
      status: statusToEn(event.status)
    });
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }
      setLoading(true);
      setEvents(prev => prev.filter(ev => ev.id !== id));
      await axios.delete(`http://localhost:5000/api/sales-events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchEvents();
      setError(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (err.response?.status === 404) {
          setError('Không tìm thấy sự kiện cần xóa.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể xóa sự kiện'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi xóa sự kiện');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
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

      // Convert data to backend format
      const eventData = {
        ...formData,
        type: typeToEn(formData.type || 'promotion'),
        status: statusToEn(formData.status || 'draft'),
        startDate: formData.startDate,
        endDate: formData.endDate,
        participants: formData.participants || [],
        budget: Number(formData.budget) || 0,
        maxParticipants: Number(formData.maxParticipants) || 0,
        discountPercentage: Number(formData.discountPercentage) || 0,
        isPublic: formData.isPublic !== undefined ? formData.isPublic : true,
        priority: Number(formData.priority) || 0
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      setLoading(true);
      if (selectedEvent) {
        await axios.put(
          `http://localhost:5000/api/sales-events/${selectedEvent.id}`, 
          eventData,
          { headers }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/sales-events', 
          eventData,
          { headers }
        );
      }

      await fetchEvents();
      handleClose();
      setError(null);
      // Hiển thị thông báo thành công
      if (selectedEvent) {
        alert('Cập nhật sự kiện thành công!');
      } else {
        alert('Thêm sự kiện thành công!');
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

  const renderCalendar = () => {
    const days = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });
    const firstDay = startOfMonth(currentDate).getDay();
    const lastDay = endOfMonth(currentDate).getDay();
    // Fill empty cells at start
    const leadingEmpty = Array.from({length: firstDay}, (_, i) => null);
    // Fill empty cells at end
    const trailingEmpty = Array.from({length: 6 - lastDay}, (_, i) => null);
    const allCells = [...leadingEmpty, ...days, ...trailingEmpty];

    const getEventsForDay = (date: Date) => {
      return events.filter(event => {
        const eventDate = new Date(event.startDate);
        return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });
    };

    return (
      <Box sx={{ border: '1px solid #1565C0', borderRadius: 0, overflow: 'hidden', bgcolor: '#fff' }}>
        <Grid container spacing={0} sx={{ borderBottom: '2px solid #1565C0' }}>
          {['SUN','MON','TUES','WED','THURS','FRI','SAT'].map(day => (
            <Grid item xs={1.714} key={day} sx={{ bgcolor: '#1565C0', color: '#fff', textAlign: 'center', py: 1, fontWeight: 'bold', borderRight: '1px solid #fff', fontSize: 18 }}>
              {day}
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={0} columns={7} sx={{ minHeight: 480 }}>
          {allCells.map((cell, idx) => (
            <Grid item xs={1} key={idx} sx={{ borderRight: (idx+1)%7===0 ? 'none' : '1px solid #e0e0e0', borderBottom: idx >= allCells.length-7 ? 'none' : '1px solid #e0e0e0', minHeight: 90, bgcolor: cell === null && idx >= allCells.length-7 ? '#E3F2FD' : '#fff', position: 'relative', px: 1, pt: 1 }}>
              {cell && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#222', position: 'absolute', top: 6, left: 8, fontSize: 15 }}>{format(cell, 'd')}</Typography>
                  <Box sx={{ mt: 3 }}>
                    {getEventsForDay(cell).map(event => (
                      <Box key={event.id} sx={getEventBoxStyle(event.type)} onClick={() => handleEdit(event)}
                        onMouseDown={e => e.stopPropagation()}
                        >
                        <span style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{event.title}</span>
                        <DeleteIcon
                          fontSize="small"
                          sx={{ ml: 1, color: '#F44336', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}
                          onClick={e => {
                            e.stopPropagation();
                            if(window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) handleDelete(event.id);
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Grid>
          ))}
        </Grid>
        <Box sx={{ borderTop: '2px solid #1565C0', bgcolor: '#F5F5F5', px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#222' }}>Notes</Typography>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Lịch sự kiện bán hàng
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleAdd}
          startIcon={<AddIcon />}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Thêm sự kiện
        </Button>
      </Box>

      <Box sx={{ 
        mb: 3,
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
        boxShadow: 1
      }}>
        <CustomDatePicker
          label="Chọn tháng"
          value={currentDate}
          onChange={(newValue) => newValue && setCurrentDate(newValue)}
        />
      </Box>

      {renderCalendar()}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          {selectedEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              name="title"
              label="Tiêu đề sự kiện"
              value={formData.title || ''}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="description"
              label="Mô tả"
              multiline
              rows={2}
              value={formData.description || ''}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <CustomDatePicker
                label="Ngày bắt đầu"
                value={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    startDate: newValue ? format(newValue, 'yyyy-MM-dd') : ''
                  }));
                }}
                sx={{ flex: 1 }}
              />
              <CustomDatePicker
                label="Ngày kết thúc"
                value={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    endDate: newValue ? format(newValue, 'yyyy-MM-dd') : ''
                  }));
                }}
                sx={{ flex: 1 }}
              />
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Loại sự kiện</InputLabel>
              <Select
                name="type"
                value={formData.type || ''}
                onChange={handleInputChange}
                error={!!errors.type}
                label="Loại sự kiện"
              >
                <MenuItem value="promotion">Khuyến mãi</MenuItem>
                <MenuItem value="event">Sự kiện</MenuItem>
                <MenuItem value="meeting">Họp</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                error={!!errors.status}
                label="Trạng thái"
              >
                <MenuItem value="draft">Chưa bắt đầu</MenuItem>
                <MenuItem value="active">Đang diễn ra</MenuItem>
                <MenuItem value="inactive">Đã kết thúc</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="location"
              label="Địa điểm"
              value={formData.location || ''}
              onChange={handleInputChange}
              error={!!errors.location}
              helperText={errors.location}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="participants"
              label="Người tham gia (phân cách bằng dấu phẩy)"
              value={formData.participants?.join(', ') || ''}
              onChange={(e) => {
                const participants = e.target.value.split(',').map(p => p.trim());
                setFormData(prev => ({
                  ...prev,
                  participants
                }));
              }}
              error={!!errors.participants}
              helperText={errors.participants}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="budget"
              label="Ngân sách (VND)"
              type="number"
              value={formData.budget || ''}
              onChange={handleInputChange}
              error={!!errors.budget}
              helperText={errors.budget}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="maxParticipants"
              label="Số lượng tối đa"
              type="number"
              value={formData.maxParticipants || ''}
              onChange={handleInputChange}
              error={!!errors.maxParticipants}
              helperText={errors.maxParticipants}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="discountPercentage"
              label="Phần trăm giảm giá (%)"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              value={formData.discountPercentage || ''}
              onChange={handleInputChange}
              error={!!errors.discountPercentage}
              helperText={errors.discountPercentage}
              sx={{ mb: 2 }}
            />
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
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="image"
              label="URL hình ảnh"
              value={formData.image || ''}
              onChange={handleInputChange}
              error={!!errors.image}
              helperText={errors.image}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="bannerImage"
              label="URL banner"
              value={formData.bannerImage || ''}
              onChange={handleInputChange}
              error={!!errors.bannerImage}
              helperText={errors.bannerImage}
              sx={{ mb: 2 }}
            />
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
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="notes"
              label="Ghi chú"
              multiline
              rows={3}
              value={formData.notes || ''}
              onChange={handleInputChange}
              error={!!errors.notes}
              helperText={errors.notes}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            {selectedEvent ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesCalendar; 