import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Tạo instance axios với URL cơ sở
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý response
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Đã có lỗi xảy ra',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

// Kiểm tra và xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Kiểm tra xem người dùng đã đăng nhập chưa
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Kiểm tra token có hợp lệ không
    const decoded = jwtDecode(token);
    // Kiểm tra token có hết hạn không
    const currentTime = Date.now() / 1000;
    if (decoded.expire < currentTime) {
      // Token hết hạn
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    return true;
  } catch (error) {
    // Token không hợp lệ
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Service xử lý API liên quan đến xác thực
export const authService = {
  // Đăng ký tài khoản
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Lưu token vào localStorage
      localStorage.setItem('token', response.token);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    return {
      success: true,
      message: 'Đăng xuất thành công',
    };
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Quên mật khẩu
  forgotPassword: async (data) => {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Kiểm tra token đặt lại mật khẩu
  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/auth/reset-password/${token}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (data) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Cập nhật thông tin người dùng
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Thay đổi mật khẩu
  changePassword: async (data) => {
    try {
      const response = await api.put('/auth/change-password', data);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },
};

// Service xử lý API liên quan đến nhà hàng
export const restaurantService = {
  // Lấy danh sách nhà hàng
  getAllRestaurants: async (params) => {
    try {
      const response = await api.get('/restaurants', { params });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Lấy thông tin chi tiết nhà hàng
  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Lấy danh sách món ăn của nhà hàng
  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Tìm kiếm nhà hàng
  searchRestaurants: async (query) => {
    try {
      const response = await api.get('/restaurants/search', { params: { query } });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Lấy danh sách nhà hàng theo danh mục
  getRestaurantsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}/restaurants`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Đánh giá nhà hàng
  rateRestaurant: async (restaurantId, reviewData) => {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/reviews`, reviewData);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },
};

// Service xử lý API liên quan đến đơn hàng
export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Lấy danh sách đơn hàng của người dùng
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }
  },
};

// Export default object chứa tất cả services
export default {
  auth: authService,
  restaurants: restaurantService,
  orders: orderService,
}; 