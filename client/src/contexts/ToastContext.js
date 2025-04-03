import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Tạo context
const ToastContext = createContext();

// Component Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Hàm thêm toast
  const addToast = useCallback((content, type = 'info', autoHideDuration = 5000) => {
    const id = uuidv4();
    const toast = {
      id,
      content,
      type,
      autoHideDuration,
    };
    
    setToasts((prev) => [...prev, toast]);
    
    // Tự động xóa toast sau khoảng thời gian
    if (autoHideDuration) {
      setTimeout(() => {
        removeToast(id);
      }, autoHideDuration);
    }
    
    return id;
  }, []);

  // Hàm xóa toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Các hàm helper để tạo toasts với các loại khác nhau
  const success = useCallback((content, options = {}) => {
    return addToast(content, 'success', options.autoHideDuration);
  }, [addToast]);

  const error = useCallback((content, options = {}) => {
    return addToast(content, 'error', options.autoHideDuration);
  }, [addToast]);

  const warning = useCallback((content, options = {}) => {
    return addToast(content, 'warning', options.autoHideDuration);
  }, [addToast]);

  const info = useCallback((content, options = {}) => {
    return addToast(content, 'info', options.autoHideDuration);
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook custom để sử dụng ToastContext
export const useToastContext = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToastContext phải được sử dụng trong ToastProvider');
  }
  
  return context;
};

export default ToastContext; 