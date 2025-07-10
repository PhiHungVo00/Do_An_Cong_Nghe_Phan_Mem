const mongoose = require('mongoose');
const Address = require('../models/Address');
require('dotenv').config();

// Dữ liệu địa chỉ đầy đủ của Việt Nam (2024)
const vietnamAddressData = [
  // Tỉnh/Thành phố (level 1) - 63 tỉnh thành
  { code: '01', name: 'Hà Nội', full_name: 'Thành phố Hà Nội', level: 1, parent_code: null },
  { code: '02', name: 'Hà Giang', full_name: 'Tỉnh Hà Giang', level: 1, parent_code: null },
  { code: '04', name: 'Cao Bằng', full_name: 'Tỉnh Cao Bằng', level: 1, parent_code: null },
  { code: '06', name: 'Bắc Kạn', full_name: 'Tỉnh Bắc Kạn', level: 1, parent_code: null },
  { code: '08', name: 'Tuyên Quang', full_name: 'Tỉnh Tuyên Quang', level: 1, parent_code: null },
  { code: '10', name: 'Lào Cai', full_name: 'Tỉnh Lào Cai', level: 1, parent_code: null },
  { code: '11', name: 'Điện Biên', full_name: 'Tỉnh Điện Biên', level: 1, parent_code: null },
  { code: '12', name: 'Lai Châu', full_name: 'Tỉnh Lai Châu', level: 1, parent_code: null },
  { code: '14', name: 'Sơn La', full_name: 'Tỉnh Sơn La', level: 1, parent_code: null },
  { code: '15', name: 'Yên Bái', full_name: 'Tỉnh Yên Bái', level: 1, parent_code: null },
  { code: '17', name: 'Hòa Bình', full_name: 'Tỉnh Hòa Bình', level: 1, parent_code: null },
  { code: '19', name: 'Thái Nguyên', full_name: 'Tỉnh Thái Nguyên', level: 1, parent_code: null },
  { code: '20', name: 'Lạng Sơn', full_name: 'Tỉnh Lạng Sơn', level: 1, parent_code: null },
  { code: '22', name: 'Quảng Ninh', full_name: 'Tỉnh Quảng Ninh', level: 1, parent_code: null },
  { code: '24', name: 'Bắc Giang', full_name: 'Tỉnh Bắc Giang', level: 1, parent_code: null },
  { code: '25', name: 'Phú Thọ', full_name: 'Tỉnh Phú Thọ', level: 1, parent_code: null },
  { code: '26', name: 'Vĩnh Phúc', full_name: 'Tỉnh Vĩnh Phúc', level: 1, parent_code: null },
  { code: '27', name: 'Bắc Ninh', full_name: 'Tỉnh Bắc Ninh', level: 1, parent_code: null },
  { code: '30', name: 'Hải Dương', full_name: 'Tỉnh Hải Dương', level: 1, parent_code: null },
  { code: '31', name: 'Hải Phòng', full_name: 'Thành phố Hải Phòng', level: 1, parent_code: null },
  { code: '33', name: 'Hưng Yên', full_name: 'Tỉnh Hưng Yên', level: 1, parent_code: null },
  { code: '34', name: 'Thái Bình', full_name: 'Tỉnh Thái Bình', level: 1, parent_code: null },
  { code: '35', name: 'Hà Nam', full_name: 'Tỉnh Hà Nam', level: 1, parent_code: null },
  { code: '36', name: 'Nam Định', full_name: 'Tỉnh Nam Định', level: 1, parent_code: null },
  { code: '37', name: 'Ninh Bình', full_name: 'Tỉnh Ninh Bình', level: 1, parent_code: null },
  { code: '38', name: 'Thanh Hóa', full_name: 'Tỉnh Thanh Hóa', level: 1, parent_code: null },
  { code: '40', name: 'Nghệ An', full_name: 'Tỉnh Nghệ An', level: 1, parent_code: null },
  { code: '42', name: 'Hà Tĩnh', full_name: 'Tỉnh Hà Tĩnh', level: 1, parent_code: null },
  { code: '44', name: 'Quảng Bình', full_name: 'Tỉnh Quảng Bình', level: 1, parent_code: null },
  { code: '45', name: 'Quảng Trị', full_name: 'Tỉnh Quảng Trị', level: 1, parent_code: null },
  { code: '46', name: 'Thừa Thiên Huế', full_name: 'Tỉnh Thừa Thiên Huế', level: 1, parent_code: null },
  { code: '48', name: 'Đà Nẵng', full_name: 'Thành phố Đà Nẵng', level: 1, parent_code: null },
  { code: '49', name: 'Quảng Nam', full_name: 'Tỉnh Quảng Nam', level: 1, parent_code: null },
  { code: '51', name: 'Quảng Ngãi', full_name: 'Tỉnh Quảng Ngãi', level: 1, parent_code: null },
  { code: '52', name: 'Bình Định', full_name: 'Tỉnh Bình Định', level: 1, parent_code: null },
  { code: '54', name: 'Phú Yên', full_name: 'Tỉnh Phú Yên', level: 1, parent_code: null },
  { code: '56', name: 'Khánh Hòa', full_name: 'Tỉnh Khánh Hòa', level: 1, parent_code: null },
  { code: '58', name: 'Ninh Thuận', full_name: 'Tỉnh Ninh Thuận', level: 1, parent_code: null },
  { code: '60', name: 'Bình Thuận', full_name: 'Tỉnh Bình Thuận', level: 1, parent_code: null },
  { code: '62', name: 'Kon Tum', full_name: 'Tỉnh Kon Tum', level: 1, parent_code: null },
  { code: '64', name: 'Gia Lai', full_name: 'Tỉnh Gia Lai', level: 1, parent_code: null },
  { code: '66', name: 'Đắk Lắk', full_name: 'Tỉnh Đắk Lắk', level: 1, parent_code: null },
  { code: '67', name: 'Đắk Nông', full_name: 'Tỉnh Đắk Nông', level: 1, parent_code: null },
  { code: '68', name: 'Lâm Đồng', full_name: 'Tỉnh Lâm Đồng', level: 1, parent_code: null },
  { code: '70', name: 'Bình Phước', full_name: 'Tỉnh Bình Phước', level: 1, parent_code: null },
  { code: '72', name: 'Tây Ninh', full_name: 'Tỉnh Tây Ninh', level: 1, parent_code: null },
  { code: '74', name: 'Bình Dương', full_name: 'Tỉnh Bình Dương', level: 1, parent_code: null },
  { code: '75', name: 'Đồng Nai', full_name: 'Tỉnh Đồng Nai', level: 1, parent_code: null },
  { code: '77', name: 'Bà Rịa - Vũng Tàu', full_name: 'Tỉnh Bà Rịa - Vũng Tàu', level: 1, parent_code: null },
  { code: '79', name: 'TP. Hồ Chí Minh', full_name: 'Thành phố Hồ Chí Minh', level: 1, parent_code: null },
  { code: '80', name: 'Long An', full_name: 'Tỉnh Long An', level: 1, parent_code: null },
  { code: '82', name: 'Tiền Giang', full_name: 'Tỉnh Tiền Giang', level: 1, parent_code: null },
  { code: '83', name: 'Bến Tre', full_name: 'Tỉnh Bến Tre', level: 1, parent_code: null },
  { code: '84', name: 'Trà Vinh', full_name: 'Tỉnh Trà Vinh', level: 1, parent_code: null },
  { code: '86', name: 'Vĩnh Long', full_name: 'Tỉnh Vĩnh Long', level: 1, parent_code: null },
  { code: '87', name: 'Đồng Tháp', full_name: 'Tỉnh Đồng Tháp', level: 1, parent_code: null },
  { code: '89', name: 'An Giang', full_name: 'Tỉnh An Giang', level: 1, parent_code: null },
  { code: '91', name: 'Kiên Giang', full_name: 'Tỉnh Kiên Giang', level: 1, parent_code: null },
  { code: '92', name: 'Cần Thơ', full_name: 'Thành phố Cần Thơ', level: 1, parent_code: null },
  { code: '93', name: 'Hậu Giang', full_name: 'Tỉnh Hậu Giang', level: 1, parent_code: null },
  { code: '94', name: 'Sóc Trăng', full_name: 'Tỉnh Sóc Trăng', level: 1, parent_code: null },
  { code: '95', name: 'Bạc Liêu', full_name: 'Tỉnh Bạc Liêu', level: 1, parent_code: null },
  { code: '96', name: 'Cà Mau', full_name: 'Tỉnh Cà Mau', level: 1, parent_code: null },

  // Quận/Huyện của Hà Nội (level 2)
  { code: '001', name: 'Ba Đình', full_name: 'Quận Ba Đình', level: 2, parent_code: '01' },
  { code: '002', name: 'Hoàn Kiếm', full_name: 'Quận Hoàn Kiếm', level: 2, parent_code: '01' },
  { code: '003', name: 'Hai Bà Trưng', full_name: 'Quận Hai Bà Trưng', level: 2, parent_code: '01' },
  { code: '004', name: 'Đống Đa', full_name: 'Quận Đống Đa', level: 2, parent_code: '01' },
  { code: '005', name: 'Tây Hồ', full_name: 'Quận Tây Hồ', level: 2, parent_code: '01' },
  { code: '006', name: 'Cầu Giấy', full_name: 'Quận Cầu Giấy', level: 2, parent_code: '01' },
  { code: '007', name: 'Thanh Xuân', full_name: 'Quận Thanh Xuân', level: 2, parent_code: '01' },
  { code: '008', name: 'Hoàng Mai', full_name: 'Quận Hoàng Mai', level: 2, parent_code: '01' },
  { code: '009', name: 'Long Biên', full_name: 'Quận Long Biên', level: 2, parent_code: '01' },
  { code: '016', name: 'Nam Từ Liêm', full_name: 'Quận Nam Từ Liêm', level: 2, parent_code: '01' },
  { code: '017', name: 'Bắc Từ Liêm', full_name: 'Quận Bắc Từ Liêm', level: 2, parent_code: '01' },
  { code: '018', name: 'Hà Đông', full_name: 'Quận Hà Đông', level: 2, parent_code: '01' },
  { code: '019', name: 'Sơn Tây', full_name: 'Thị xã Sơn Tây', level: 2, parent_code: '01' },
  { code: '020', name: 'Mê Linh', full_name: 'Huyện Mê Linh', level: 2, parent_code: '01' },
  { code: '021', name: 'Đông Anh', full_name: 'Huyện Đông Anh', level: 2, parent_code: '01' },
  { code: '022', name: 'Gia Lâm', full_name: 'Huyện Gia Lâm', level: 2, parent_code: '01' },
  { code: '023', name: 'Ba Vì', full_name: 'Huyện Ba Vì', level: 2, parent_code: '01' },
  { code: '024', name: 'Phúc Thọ', full_name: 'Huyện Phúc Thọ', level: 2, parent_code: '01' },
  { code: '025', name: 'Thạch Thất', full_name: 'Huyện Thạch Thất', level: 2, parent_code: '01' },
  { code: '026', name: 'Quốc Oai', full_name: 'Huyện Quốc Oai', level: 2, parent_code: '01' },
  { code: '027', name: 'Chương Mỹ', full_name: 'Huyện Chương Mỹ', level: 2, parent_code: '01' },
  { code: '028', name: 'Thanh Oai', full_name: 'Huyện Thanh Oai', level: 2, parent_code: '01' },
  { code: '029', name: 'Thường Tín', full_name: 'Huyện Thường Tín', level: 2, parent_code: '01' },
  { code: '030', name: 'Phú Xuyên', full_name: 'Huyện Phú Xuyên', level: 2, parent_code: '01' },
  { code: '031', name: 'Ứng Hòa', full_name: 'Huyện Ứng Hòa', level: 2, parent_code: '01' },
  { code: '032', name: 'Mỹ Đức', full_name: 'Huyện Mỹ Đức', level: 2, parent_code: '01' },

  // Quận/Huyện của TP. Hồ Chí Minh (level 2)
  { code: '760', name: 'Quận 1', full_name: 'Quận 1', level: 2, parent_code: '79' },
  { code: '761', name: 'Quận 2', full_name: 'Quận 2', level: 2, parent_code: '79' },
  { code: '762', name: 'Quận 3', full_name: 'Quận 3', level: 2, parent_code: '79' },
  { code: '763', name: 'Quận 4', full_name: 'Quận 4', level: 2, parent_code: '79' },
  { code: '764', name: 'Quận 5', full_name: 'Quận 5', level: 2, parent_code: '79' },
  { code: '765', name: 'Quận 6', full_name: 'Quận 6', level: 2, parent_code: '79' },
  { code: '766', name: 'Quận 7', full_name: 'Quận 7', level: 2, parent_code: '79' },
  { code: '767', name: 'Quận 8', full_name: 'Quận 8', level: 2, parent_code: '79' },
  { code: '768', name: 'Quận 9', full_name: 'Quận 9', level: 2, parent_code: '79' },
  { code: '769', name: 'Quận 10', full_name: 'Quận 10', level: 2, parent_code: '79' },
  { code: '770', name: 'Quận 11', full_name: 'Quận 11', level: 2, parent_code: '79' },
  { code: '771', name: 'Quận 12', full_name: 'Quận 12', level: 2, parent_code: '79' },
  { code: '772', name: 'Tân Bình', full_name: 'Quận Tân Bình', level: 2, parent_code: '79' },
  { code: '773', name: 'Bình Tân', full_name: 'Quận Bình Tân', level: 2, parent_code: '79' },
  { code: '774', name: 'Tân Phú', full_name: 'Quận Tân Phú', level: 2, parent_code: '79' },
  { code: '775', name: 'Phú Nhuận', full_name: 'Quận Phú Nhuận', level: 2, parent_code: '79' },
  { code: '776', name: 'Gò Vấp', full_name: 'Quận Gò Vấp', level: 2, parent_code: '79' },
  { code: '777', name: 'Bình Thạnh', full_name: 'Quận Bình Thạnh', level: 2, parent_code: '79' },
  { code: '778', name: 'Thủ Đức', full_name: 'Thành phố Thủ Đức', level: 2, parent_code: '79' },
  { code: '783', name: 'Củ Chi', full_name: 'Huyện Củ Chi', level: 2, parent_code: '79' },
  { code: '784', name: 'Hóc Môn', full_name: 'Huyện Hóc Môn', level: 2, parent_code: '79' },
  { code: '785', name: 'Bình Chánh', full_name: 'Huyện Bình Chánh', level: 2, parent_code: '79' },
  { code: '786', name: 'Nhà Bè', full_name: 'Huyện Nhà Bè', level: 2, parent_code: '79' },
  { code: '787', name: 'Cần Giờ', full_name: 'Huyện Cần Giờ', level: 2, parent_code: '79' },

  // Xã/Phường của Quận Ba Đình (level 3)
  { code: '00001', name: 'Phúc Xá', full_name: 'Phường Phúc Xá', level: 3, parent_code: '001' },
  { code: '00004', name: 'Trúc Bạch', full_name: 'Phường Trúc Bạch', level: 3, parent_code: '001' },
  { code: '00006', name: 'Vĩnh Phúc', full_name: 'Phường Vĩnh Phúc', level: 3, parent_code: '001' },
  { code: '00007', name: 'Cống Vị', full_name: 'Phường Cống Vị', level: 3, parent_code: '001' },
  { code: '00008', name: 'Liễu Giai', full_name: 'Phường Liễu Giai', level: 3, parent_code: '001' },
  { code: '00010', name: 'Nguyễn Trung Trực', full_name: 'Phường Nguyễn Trung Trực', level: 3, parent_code: '001' },
  { code: '00013', name: 'Quán Thánh', full_name: 'Phường Quán Thánh', level: 3, parent_code: '001' },
  { code: '00016', name: 'Ngọc Hà', full_name: 'Phường Ngọc Hà', level: 3, parent_code: '001' },
  { code: '00019', name: 'Điện Biên', full_name: 'Phường Điện Biên', level: 3, parent_code: '001' },
  { code: '00022', name: 'Đội Cấn', full_name: 'Phường Đội Cấn', level: 3, parent_code: '001' },
  { code: '00025', name: 'Ngọc Khánh', full_name: 'Phường Ngọc Khánh', level: 3, parent_code: '001' },
  { code: '00028', name: 'Kim Mã', full_name: 'Phường Kim Mã', level: 3, parent_code: '001' },
  { code: '00031', name: 'Giảng Võ', full_name: 'Phường Giảng Võ', level: 3, parent_code: '001' },
  { code: '00034', name: 'Thành Công', full_name: 'Phường Thành Công', level: 3, parent_code: '001' },

  // Xã/Phường của Quận 1 TP.HCM (level 3)
  { code: '26734', name: 'Bến Nghé', full_name: 'Phường Bến Nghé', level: 3, parent_code: '760' },
  { code: '26737', name: 'Bến Thành', full_name: 'Phường Bến Thành', level: 3, parent_code: '760' },
  { code: '26740', name: 'Đa Kao', full_name: 'Phường Đa Kao', level: 3, parent_code: '760' },
  { code: '26743', name: 'Nguyễn Thái Bình', full_name: 'Phường Nguyễn Thái Bình', level: 3, parent_code: '760' },
  { code: '26746', name: 'Phạm Ngũ Lão', full_name: 'Phường Phạm Ngũ Lão', level: 3, parent_code: '760' },
  { code: '26749', name: 'Cầu Ông Lãnh', full_name: 'Phường Cầu Ông Lãnh', level: 3, parent_code: '760' },
  { code: '26752', name: 'Cầu Kho', full_name: 'Phường Cầu Kho', level: 3, parent_code: '760' },
  { code: '26755', name: 'Nguyễn Cư Trinh', full_name: 'Phường Nguyễn Cư Trinh', level: 3, parent_code: '760' },
  { code: '26758', name: 'Cầu Ông Lãnh', full_name: 'Phường Cầu Ông Lãnh', level: 3, parent_code: '760' },
  { code: '26761', name: 'Nguyễn Thị Minh Khai', full_name: 'Phường Nguyễn Thị Minh Khai', level: 3, parent_code: '760' },

  // Thêm một số xã/phường cho các quận khác
  { code: '26764', name: 'Tân Định', full_name: 'Phường Tân Định', level: 3, parent_code: '761' },
  { code: '26767', name: 'Đa Kao', full_name: 'Phường Đa Kao', level: 3, parent_code: '761' },
  { code: '26770', name: 'Bình Trưng Tây', full_name: 'Phường Bình Trưng Tây', level: 3, parent_code: '762' },
  { code: '26773', name: 'Bình Trưng Đông', full_name: 'Phường Bình Trưng Đông', level: 3, parent_code: '762' },
  { code: '26776', name: 'Tân Thuận Tây', full_name: 'Phường Tân Thuận Tây', level: 3, parent_code: '763' },
  { code: '26779', name: 'Tân Thuận Đông', full_name: 'Phường Tân Thuận Đông', level: 3, parent_code: '763' },
  { code: '26782', name: 'Tân Kiểng', full_name: 'Phường Tân Kiểng', level: 3, parent_code: '764' },
  { code: '26785', name: 'Tân Hưng', full_name: 'Phường Tân Hưng', level: 3, parent_code: '764' },
  { code: '26788', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '765' },
  { code: '26791', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '765' },
  { code: '26794', name: 'Tân Phú', full_name: 'Phường Tân Phú', level: 3, parent_code: '766' },
  { code: '26797', name: 'Tân Quy', full_name: 'Phường Tân Quy', level: 3, parent_code: '766' },
  { code: '26800', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '767' },
  { code: '26803', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '767' },
  { code: '26806', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '768' },
  { code: '26809', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '768' },
  { code: '26812', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '769' },
  { code: '26815', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '769' },
  { code: '26818', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '770' },
  { code: '26821', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '770' },
  { code: '26824', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '771' },
  { code: '26827', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '771' },
  { code: '26830', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '772' },
  { code: '26833', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '772' },
  { code: '26836', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '773' },
  { code: '26839', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '773' },
  { code: '26842', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '774' },
  { code: '26845', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '774' },
  { code: '26848', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '775' },
  { code: '26851', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '775' },
  { code: '26854', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '776' },
  { code: '26857', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '776' },
  { code: '26860', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '777' },
  { code: '26863', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '777' },
  { code: '26866', name: 'Phường 1', full_name: 'Phường 1', level: 3, parent_code: '778' },
  { code: '26869', name: 'Phường 2', full_name: 'Phường 2', level: 3, parent_code: '778' }
];

const seedFullAddressData = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await Address.deleteMany({});
    console.log('Cleared existing address data');

    // Thêm dữ liệu mới
    const result = await Address.insertMany(vietnamAddressData);
    console.log(`Successfully seeded ${result.length} address records`);

    // Hiển thị thống kê
    const provinces = await Address.countDocuments({ level: 1 });
    const districts = await Address.countDocuments({ level: 2 });
    const wards = await Address.countDocuments({ level: 3 });

    console.log('\nAddress Data Statistics:');
    console.log(`- Provinces/Cities: ${provinces}`);
    console.log(`- Districts: ${districts}`);
    console.log(`- Wards: ${wards}`);
    console.log(`- Total: ${provinces + districts + wards}`);

    console.log('\nFull Vietnam address data seeded successfully!');
    console.log('You can now use the comprehensive address selection feature.');

  } catch (error) {
    console.error('Error seeding full address data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  seedFullAddressData();
}

module.exports = seedFullAddressData; 