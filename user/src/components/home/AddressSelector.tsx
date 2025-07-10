import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn,
  MyLocation,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { addressAPI } from '../../services/api';
import GoogleMapSelector from './GoogleMapSelector';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    minWidth: 400,
    [theme.breakpoints.down('sm')]: {
      minWidth: '90vw',
      margin: 16,
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
}));

interface AddressData {
  code: string;
  name: string;
  full_name: string;
  level: number;
  parent_code?: string;
}

interface AddressSelectorProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
  currentAddress?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  open,
  onClose,
  onSave,
  currentAddress = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State cho dữ liệu địa chỉ
  const [provinces, setProvinces] = useState<AddressData[]>([]);
  const [districts, setDistricts] = useState<AddressData[]>([]);
  const [wards, setWards] = useState<AddressData[]>([]);
  
  // State cho lựa chọn
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [streetName, setStreetName] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<string>('');
  
  // State cho loading từng cấp
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  
  // State cho Google Maps
  const [openGoogleMap, setOpenGoogleMap] = useState(false);

  // Fetch provinces khi component mount
  useEffect(() => {
    if (open) {
      fetchProvinces();
    }
  }, [open]);

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await addressAPI.getProvinces();
      setProvinces(data.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setError('Lỗi kết nối khi tải danh sách tỉnh/thành phố');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (provinceCode: string) => {
    try {
      setLoadingDistricts(true);
      setError(null);
      
      const data = await addressAPI.getDistricts(provinceCode);
      setDistricts(data.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('Lỗi kết nối khi tải danh sách quận/huyện');
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchWards = async (districtCode: string) => {
    try {
      setLoadingWards(true);
      setError(null);
      
      const data = await addressAPI.getWards(districtCode);
      setWards(data.data);
    } catch (error) {
      console.error('Error fetching wards:', error);
      setError('Lỗi kết nối khi tải danh sách xã/phường');
    } finally {
      setLoadingWards(false);
    }
  };

  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    
    if (provinceCode) {
      fetchDistricts(provinceCode);
    }
  };

  const handleDistrictChange = (districtCode: string) => {
    setSelectedDistrict(districtCode);
    setSelectedWard('');
    setWards([]);
    
    if (districtCode) {
      fetchWards(districtCode);
    }
  };

  const handleWardChange = (wardCode: string) => {
    setSelectedWard(wardCode);
  };

  const resetForm = () => {
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setStreetName('');
    setHouseNumber('');
    setDistricts([]);
    setWards([]);
    setError(null);
  };

  const handleSave = () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      setError('Vui lòng chọn đầy đủ thông tin địa chỉ');
      return;
    }

    const province = provinces.find(p => p.code === selectedProvince);
    const district = districts.find(d => d.code === selectedDistrict);
    const ward = wards.find(w => w.code === selectedWard);

    if (!province || !district || !ward) {
      setError('Dữ liệu địa chỉ không hợp lệ');
      return;
    }

    const addressParts = [];
    
    if (houseNumber.trim()) {
      addressParts.push(houseNumber.trim());
    }
    
    if (streetName.trim()) {
      addressParts.push(streetName.trim());
    }
    
    addressParts.push(ward.name);
    addressParts.push(district.name);
    addressParts.push(province.name);

    const fullAddress = addressParts.join(', ');
    onSave(fullAddress);
    onClose();
  };

  const handleGoogleMapSelect = (addressData: any) => {
    onSave(addressData.formatted_address);
    setOpenGoogleMap(false);
  };

  const handleOpenGoogleMap = () => {
    setOpenGoogleMap(true);
  };

  const getSelectedProvinceName = () => {
    return provinces.find(p => p.code === selectedProvince)?.name || '';
  };

  const getSelectedDistrictName = () => {
    return districts.find(d => d.code === selectedDistrict)?.name || '';
  };

  const getSelectedWardName = () => {
    return wards.find(w => w.code === selectedWard)?.name || '';
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <LocationOn color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Chọn địa chỉ giao hàng</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Tỉnh/Thành phố */}
          <Grid item xs={12}>
            <StyledFormControl>
              <InputLabel>Tỉnh/Thành phố *</InputLabel>
              <Select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                label="Tỉnh/Thành phố *"
                disabled={loading}
              >
                {loading ? (
                  <MenuItem disabled>
                    <Box display="flex" alignItems="center">
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang tải...
                    </Box>
                  </MenuItem>
                ) : (
                  provinces.map((province) => (
                    <MenuItem key={province.code} value={province.code}>
                      {province.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </StyledFormControl>
          </Grid>

          {/* Quận/Huyện */}
          <Grid item xs={12}>
            <StyledFormControl>
              <InputLabel>Quận/Huyện *</InputLabel>
              <Select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                label="Quận/Huyện *"
                disabled={!selectedProvince || loadingDistricts}
              >
                {loadingDistricts ? (
                  <MenuItem disabled>
                    <Box display="flex" alignItems="center">
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang tải...
                    </Box>
                  </MenuItem>
                ) : (
                  districts.map((district) => (
                    <MenuItem key={district.code} value={district.code}>
                      {district.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </StyledFormControl>
          </Grid>

          {/* Xã/Phường */}
          <Grid item xs={12}>
            <StyledFormControl>
              <InputLabel>Xã/Phường *</InputLabel>
              <Select
                value={selectedWard}
                onChange={(e) => handleWardChange(e.target.value)}
                label="Xã/Phường *"
                disabled={!selectedDistrict || loadingWards}
              >
                {loadingWards ? (
                  <MenuItem disabled>
                    <Box display="flex" alignItems="center">
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang tải...
                    </Box>
                  </MenuItem>
                ) : (
                  wards.map((ward) => (
                    <MenuItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </StyledFormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thông tin chi tiết
            </Typography>
          </Grid>

          {/* Google Maps Option */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleOpenGoogleMap}
                startIcon={<MyLocation />}
                sx={{ mb: 2 }}
              >
                Chọn địa chỉ trên bản đồ Google Maps
              </Button>
            </Box>
          </Grid>

          {/* Tên đường */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên đường"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Huệ, Lê Lợi..."
            />
          </Grid>

          {/* Số nhà */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số nhà"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              placeholder="Ví dụ: 123, 45A..."
            />
          </Grid>

          {/* Preview địa chỉ */}
          {(selectedProvince || selectedDistrict || selectedWard || streetName || houseNumber) && (
            <Grid item xs={12}>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Địa chỉ giao hàng:
                </Typography>
                <Typography variant="body2">
                  {[
                    houseNumber,
                    streetName,
                    getSelectedWardName(),
                    getSelectedDistrictName(),
                    getSelectedProvinceName()
                  ].filter(Boolean).join(', ')}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selectedProvince || !selectedDistrict || !selectedWard}
          startIcon={<MyLocation />}
        >
          Lưu địa chỉ
        </Button>
      </DialogActions>

      {/* Google Maps Selector */}
      <GoogleMapSelector
        open={openGoogleMap}
        onClose={() => setOpenGoogleMap(false)}
        onSelectAddress={handleGoogleMapSelect}
      />
    </StyledDialog>
  );
};

export default AddressSelector; 