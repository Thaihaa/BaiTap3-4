import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
import { authService } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const toast = useToastContext();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setError('Email không được để trống');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      
      if (response.success) {
        setSuccess(true);
        toast.success('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn');
      } else {
        setError(response.message || 'Không thể gửi yêu cầu đặt lại mật khẩu');
        toast.error('Không thể gửi yêu cầu đặt lại mật khẩu');
      }
    } catch (error) {
      console.error(error);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {!success ? (
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 3
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Quên mật khẩu
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Gửi yêu cầu'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowBackIcon />}
                color="inherit"
              >
                Quay lại đăng nhập
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="primary">
              Yêu cầu đã được gửi!
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>.
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn.
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Nếu bạn không nhận được email trong vòng vài phút, hãy kiểm tra thư mục spam
              hoặc thử lại với một địa chỉ email khác.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
              >
                Quay lại đăng nhập
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
              >
                Thử lại
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword; 