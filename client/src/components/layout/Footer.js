import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  TextField, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Instagram as InstagramIcon, 
  Twitter as TwitterIcon, 
  YouTube as YouTubeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  Send as SendIcon 
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      sx={{ 
        bgcolor: 'primary.dark', 
        color: 'white', 
        pt: 6, 
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Thông tin công ty */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon sx={{ mr: 1 }} />
              <Typography variant="h5" component="div" fontWeight="bold">
                FoodDelivery
              </Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Dịch vụ giao đồ ăn nhanh chóng và tiện lợi, kết nối bạn với hàng ngàn nhà hàng chất lượng.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton color="inherit" aria-label="Facebook" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube" size="small">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Liên kết nhanh */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              Liên kết nhanh
            </Typography>
            <List dense disablePadding>
              <ListItem button component={Link} to="/" sx={{ p: 0.5 }}>
                <ListItemText primary="Trang chủ" />
              </ListItem>
              <ListItem button component={Link} to="/restaurants" sx={{ p: 0.5 }}>
                <ListItemText primary="Nhà hàng" />
              </ListItem>
              <ListItem button component={Link} to="/about" sx={{ p: 0.5 }}>
                <ListItemText primary="Về chúng tôi" />
              </ListItem>
              <ListItem button component={Link} to="/contact" sx={{ p: 0.5 }}>
                <ListItemText primary="Liên hệ" />
              </ListItem>
              <ListItem button component={Link} to="/blog" sx={{ p: 0.5 }}>
                <ListItemText primary="Blog" />
              </ListItem>
            </List>
          </Grid>

          {/* Thông tin liên hệ */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              Liên hệ
            </Typography>
            <List dense disablePadding>
              <ListItem sx={{ p: 0.5 }}>
                <ListItemIcon sx={{ color: 'white', minWidth: 30 }}>
                  <LocationIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="123 Đường ẩm thực, Quận 1, TP.HCM" />
              </ListItem>
              <ListItem sx={{ p: 0.5 }}>
                <ListItemIcon sx={{ color: 'white', minWidth: 30 }}>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="(028) 1234 5678" />
              </ListItem>
              <ListItem sx={{ p: 0.5 }}>
                <ListItemIcon sx={{ color: 'white', minWidth: 30 }}>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="info@fooddelivery.com" />
              </ListItem>
            </List>
          </Grid>

          {/* Đăng ký nhận tin */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              Đăng ký nhận thông tin
            </Typography>
            <Typography variant="body2" paragraph>
              Nhận thông tin ưu đãi và tin tức mới nhất từ chúng tôi.
            </Typography>
            <Box 
              component="form" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TextField
                placeholder="Email của bạn"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  sx: { 
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    }
                  }
                }}
              />
              <Button 
                variant="contained" 
                color="secondary"
                sx={{ ml: 1, height: 40, minWidth: 40, width: 40, px: 0 }}
              >
                <SendIcon fontSize="small" />
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />
        
        {/* Footer bottom */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            &copy; {currentYear} FoodDelivery. Tất cả quyền đã được bảo lưu.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography 
              variant="body2" 
              component={Link} 
              to="/privacy-policy" 
              sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Chính sách bảo mật
            </Typography>
            <Typography 
              variant="body2" 
              component={Link} 
              to="/terms-of-service" 
              sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Điều khoản sử dụng
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 