import { useState, useCallback } from 'react';

/**
 * Hook để tạo và quản lý toast notifications
 */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Thêm toast mới
  const addToast = useCallback((message, type = 'success', timeout = 3000) => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      timeout,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Tự động xóa toast sau timeout
    setTimeout(() => {
      removeToast(id);
    }, timeout);

    return id;
  }, []);

  // Xóa toast theo id
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Các hàm tiện ích để thêm các loại toast khác nhau
  const success = useCallback(
    (message, timeout) => addToast(message, 'success', timeout),
    [addToast]
  );

  const error = useCallback(
    (message, timeout) => addToast(message, 'error', timeout),
    [addToast]
  );

  const info = useCallback(
    (message, timeout) => addToast(message, 'info', timeout),
    [addToast]
  );

  const warning = useCallback(
    (message, timeout) => addToast(message, 'warning', timeout),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};

export default useToast; 