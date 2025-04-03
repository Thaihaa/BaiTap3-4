import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  InputAdornment, 
  IconButton,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import { 
  Lock as LockIcon, 
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { authService } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToastContext();

  // Xác thực token
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authService.verifyResetToken(token);
        if (response.success) {
          setTokenValid(true);
        } else {
          toast.error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
        }
      } catch (error) {
        console.error(error);
        toast.error('Không thể xác thực liên kết đặt lại mật khẩu');
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setVerifying(false);
      toast.error('Không tìm thấy token đặt lại mật khẩu');
    }
  }, [token, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword({
        token,
        password: formData.password,
      });
      
      if (response.success) {
        setResetSuccess(true);
        toast.success('Mật khẩu đã được đặt lại thành công!');
      } else {
        toast.error(response.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trạng thái đang xác thực token
  if (verifying) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Đang xác thực liên kết...
            </Typography>
            <LinearProgress sx={{ mt: 2 }} />
          </Box>
        </Paper>
      </Container>
    );
  }

  // Hiển thị lỗi nếu token không hợp lệ
  if (!tokenValid && !verifying) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
            </Alert>
            <Typography variant="body1" paragraph>
              Vui lòng thử lại bằng cách yêu cầu liên kết đặt lại mật khẩu mới.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/forgot-password"
              sx={{ mt: 2 }}
            >
              Yêu cầu liên kết mới
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Hiển thị thông báo thành công
  if (resetSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="primary">
              Đặt lại mật khẩu thành công!
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/login"
              color="primary"
              size="large"
            >
              Đăng nhập
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Form đặt lại mật khẩu
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
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
              Đặt lại mật khẩu
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tạo mật khẩu mới cho tài khoản của bạn
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Mật khẩu mới"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
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
            {loading ? <CircularProgress size={24} /> : 'Đặt lại mật khẩu'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Button 
              component={Link} 
              to="/login" 
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              Quay lại đăng nhập
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword; 