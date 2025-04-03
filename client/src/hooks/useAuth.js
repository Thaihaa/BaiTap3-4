import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

/**
 * Custom hook quản lý trạng thái xác thực người dùng
 * @returns {object} Các phương thức và trạng thái xác thực
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const toast = useToastContext();

  /**
   * Lấy thông tin người dùng hiện tại từ API hoặc localStorage
   */
  const loadUserFromStorage = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      // Xác thực token và lấy thông tin user
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        // Token không hợp lệ, xóa token
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  /**
   * Khởi tạo hook, tải thông tin người dùng nếu có token
   */
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  /**
   * Đăng nhập người dùng
   * @param {object} userData - Thông tin người dùng
   * @param {string} token - Token JWT
   */
  const login = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  /**
   * Đăng xuất người dùng
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Cập nhật thông tin người dùng
   * @param {object} userData - Thông tin người dùng cập nhật
   */
  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  }, []);

  /**
   * Kiểm tra user có quyền truy cập dựa trên vai trò
   * @param {array} requiredRoles - Mảng các vai trò được phép truy cập
   * @returns {boolean} true nếu có quyền, false nếu không
   */
  const hasRole = useCallback((requiredRoles) => {
    if (!user || !isAuthenticated) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    
    return user.role === requiredRoles;
  }, [user, isAuthenticated]);

  return {
    user,
    isAuthenticated,
    loading,
    initialized,
    login,
    logout,
    updateUser,
    hasRole,
    loadUserFromStorage
  };
};

export default useAuth; 