import React, { useState, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  Slide, 
  Box, 
  useTheme 
} from '@mui/material';
import { useToastContext } from '../../contexts/ToastContext';

/**
 * Component ToastContainer hiển thị các thông báo toast
 * Sử dụng Snackbar và Alert của MUI
 */
const ToastContainer = () => {
  const theme = useTheme();
  const { toasts, removeToast } = useToastContext();
  const [activeToasts, setActiveToasts] = useState([]);
  
  // Cập nhật danh sách toast hiển thị khi toasts thay đổi
  useEffect(() => {
    setActiveToasts(toasts);
  }, [toasts]);
  
  // Xử lý đóng toast
  const handleClose = (id) => () => {
    removeToast(id);
  };
  
  // Animation khi toast xuất hiện
  const SlideTransition = (props) => {
    return <Slide {...props} direction="up" />;
  };
  
  // Tính toán vị trí hiển thị cho mỗi toast
  const getToastPosition = (index) => {
    // Mỗi toast cách nhau 10px
    return { bottom: `${(index * 70) + 20}px` };
  };
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        maxWidth: { xs: '100%', sm: 400 },
        zIndex: theme.zIndex.snackbar,
        pointerEvents: 'none',
        p: 2,
      }}
    >
      {activeToasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          sx={{
            position: 'absolute',
            ...getToastPosition(index),
            width: '100%',
            pointerEvents: 'all',
          }}
        >
          <Alert
            variant="filled"
            onClose={handleClose(toast.id)}
            severity={toast.type}
            sx={{ width: '100%', boxShadow: 2 }}
          >
            {toast.content}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default ToastContainer; 