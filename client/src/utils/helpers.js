/**
 * Cắt ngắn văn bản nếu vượt quá độ dài cho phép
 * @param {string} text - Văn bản cần cắt ngắn
 * @param {number} maxLength - Độ dài tối đa
 * @param {string} suffix - Hậu tố (mặc định là "...")
 * @returns {string} Văn bản đã cắt ngắn
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}${suffix}`;
};

/**
 * Format số tiền thành dạng tiền tệ
 * @param {number} amount - Số tiền
 * @param {string} currency - Mã tiền tệ (mặc định là "VND")
 * @param {string} locale - Ngôn ngữ (mặc định là "vi-VN")
 * @returns {string} Chuỗi định dạng tiền tệ
 */
export const formatCurrency = (amount, currency = 'VND', locale = 'vi-VN') => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format thời gian dưới dạng "hh:mm DD/MM/YYYY"
 * @param {string|Date} dateTime - Ngày giờ cần định dạng
 * @returns {string} Chuỗi định dạng ngày giờ
 */
export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  
  if (isNaN(date.getTime())) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

/**
 * Format ngày dưới dạng "DD/MM/YYYY"
 * @param {string|Date} date - Ngày cần định dạng
 * @returns {string} Chuỗi định dạng ngày
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Tạo chuỗi slug từ văn bản (ví dụ: "Món Ăn Ngon" -> "mon-an-ngon")
 * @param {string} text - Văn bản cần chuyển đổi
 * @returns {string} Chuỗi slug
 */
export const slugify = (text) => {
  if (!text) return '';
  
  // Chuyển về chữ thường và chuyển đổi dấu tiếng Việt
  let slug = text.toLowerCase();
  
  // Thay thế dấu tiếng Việt
  slug = slug.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a');
  slug = slug.replace(/[éèẻẽẹêếềểễệ]/g, 'e');
  slug = slug.replace(/[íìỉĩị]/g, 'i');
  slug = slug.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o');
  slug = slug.replace(/[úùủũụưứừửữự]/g, 'u');
  slug = slug.replace(/[ýỳỷỹỵ]/g, 'y');
  slug = slug.replace(/đ/g, 'd');
  
  // Thay thế ký tự đặc biệt và khoảng trắng bằng dấu gạch ngang
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  
  // Xóa dấu gạch ngang ở đầu và cuối
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
};

/**
 * Lấy thời gian tương đối (ví dụ: "1 giờ trước", "2 ngày trước")
 * @param {string|Date} dateTime - Thời gian cần tính
 * @returns {string} Chuỗi thời gian tương đối
 */
export const getRelativeTime = (dateTime) => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} năm trước`;
};

/**
 * Định dạng số điện thoại Việt Nam
 * @param {string} phoneNumber - Số điện thoại cần định dạng
 * @returns {string} Số điện thoại đã định dạng
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Định dạng số điện thoại Việt Nam 10 số: 0xx-xxx-xxxx
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Định dạng số điện thoại Việt Nam 11 số: 0xx-xxxx-xxxx
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // Nếu không phải định dạng trên thì trả về số gốc
  return phoneNumber;
};

/**
 * Kiểm tra xem một chuỗi có phải là email hợp lệ hay không
 * @param {string} email - Chuỗi cần kiểm tra
 * @returns {boolean} true nếu là email hợp lệ, ngược lại là false
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Kiểm tra xem một chuỗi có phải là số điện thoại Việt Nam hợp lệ hay không
 * @param {string} phone - Chuỗi cần kiểm tra
 * @returns {boolean} true nếu là số điện thoại hợp lệ, ngược lại là false
 */
export const isValidVietnamesePhone = (phone) => {
  if (!phone) return false;
  
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, '');
  
  // Kiểm tra độ dài và đầu số
  if (cleaned.length !== 10 && cleaned.length !== 11) return false;
  
  // Phải bắt đầu bằng số 0
  if (cleaned[0] !== '0') return false;
  
  return true;
};

/**
 * Tạo một mã ngẫu nhiên với độ dài cho trước
 * @param {number} length - Độ dài mã (mặc định là 6)
 * @returns {string} Mã ngẫu nhiên
 */
export const generateRandomCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }
  
  return code;
};

/**
 * Chuyển đổi kích thước file từ byte sang dạng dễ đọc (KB, MB, GB)
 * @param {number} bytes - Kích thước file tính bằng byte
 * @param {number} decimals - Số chữ số thập phân (mặc định là 2)
 * @returns {string} Kích thước file dạng dễ đọc
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Định dạng thời gian
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Chuyển đổi trạng thái đơn hàng sang tiếng Việt
export const translateOrderStatus = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    ready: 'Sẵn sàng giao',
    delivered: 'Đã giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };
  return statusMap[status] || status;
};

// Chuyển đổi trạng thái thanh toán sang tiếng Việt
export const translatePaymentStatus = (status) => {
  const statusMap = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền',
  };
  return statusMap[status] || status;
};

// Chuyển đổi phương thức thanh toán sang tiếng Việt
export const translatePaymentMethod = (method) => {
  const methodMap = {
    cash: 'Tiền mặt',
    credit_card: 'Thẻ tín dụng',
    bank_transfer: 'Chuyển khoản',
    momo: 'Ví MoMo',
    zalopay: 'ZaloPay',
  };
  return methodMap[method] || method;
};

// Chuyển đổi phương thức giao hàng sang tiếng Việt
export const translateDeliveryMethod = (method) => {
  const methodMap = {
    pickup: 'Lấy tại nhà hàng',
    delivery: 'Giao hàng tận nơi',
  };
  return methodMap[method] || method;
};

// Chuyển đổi trạng thái đặt bàn sang tiếng Việt
export const translateReservationStatus = (status) => {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    seated: 'Đã nhận bàn',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    no_show: 'Không đến',
  };
  return statusMap[status] || status;
};

// Tạo danh sách giờ cho đặt bàn
export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push({ value: timeString, label: timeString });
    }
  }
  return options;
};

// Tạo danh sách số lượng người cho đặt bàn
export const generatePartySizeOptions = () => {
  const options = [];
  for (let i = 1; i <= 20; i++) {
    options.push({ value: i, label: `${i} người` });
  }
  return options;
};

// Nhận màu dựa trên trạng thái đơn hàng
export const getOrderStatusColor = (status) => {
  const colorMap = {
    pending: '#f39c12', // amber
    confirmed: '#3498db', // blue
    preparing: '#1abc9c', // teal
    ready: '#9b59b6', // purple
    delivered: '#2ecc71', // green
    completed: '#27ae60', // dark green
    cancelled: '#e74c3c', // red
  };
  return colorMap[status] || '#95a5a6'; // grey default
};

// Nhận màu dựa trên trạng thái thanh toán
export const getPaymentStatusColor = (status) => {
  const colorMap = {
    pending: '#f39c12', // amber
    paid: '#2ecc71', // green
    failed: '#e74c3c', // red
    refunded: '#3498db', // blue
  };
  return colorMap[status] || '#95a5a6'; // grey default
};

// Nhận màu dựa trên trạng thái đặt bàn
export const getReservationStatusColor = (status) => {
  const colorMap = {
    pending: '#f39c12', // amber
    confirmed: '#3498db', // blue
    seated: '#9b59b6', // purple
    completed: '#2ecc71', // green
    cancelled: '#e74c3c', // red
    no_show: '#95a5a6', // grey
  };
  return colorMap[status] || '#95a5a6'; // grey default
};

// Tạo mảng phân trang
export const createPaginationArray = (currentPage, totalPages) => {
  const delta = 2;
  const range = [];
  
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }
  
  if (currentPage - delta > 2) {
    range.unshift('...');
  }
  
  if (currentPage + delta < totalPages - 1) {
    range.push('...');
  }
  
  range.unshift(1);
  if (totalPages > 1) {
    range.push(totalPages);
  }
  
  return range;
}; 