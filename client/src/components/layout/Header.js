import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
  Restaurant as RestaurantIcon,
  Home as HomeIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';

/**
 * Component Header với thanh điều hướng và menu
 */
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToastContext();
  
  // State cho menu user
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Xử lý mở menu user
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Xử lý đóng menu user
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Kiểm tra menu có đang mở không
  const isMenuOpen = Boolean(anchorEl);
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    handleMenuClose();
    logout();
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };
  
  // Xử lý chuyển hướng từ menu
  const handleMenuItemClick = (path) => {
    handleMenuClose();
    navigate(path);
  };
  
  // Toggle drawer cho mobile
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // Menu items chính
  const mainMenuItems = [
    { text: 'Trang chủ', path: '/', icon: <HomeIcon /> },
    { text: 'Nhà hàng', path: '/restaurants', icon: <RestaurantIcon /> },
  ];
  
  // Menu user khi đã đăng nhập
  const userMenuItems = [
    { text: 'Thông tin cá nhân', path: '/profile', icon: <PersonIcon /> },
    { text: 'Yêu thích', path: '/favorites', icon: <FavoriteIcon /> },
    { text: 'Đơn hàng của tôi', path: '/orders', icon: <CartIcon /> },
    { text: 'Cài đặt', path: '/settings', icon: <SettingsIcon /> },
  ];
  
  // Thêm menu quản trị nếu user là admin
  if (user && user.role === 'admin') {
    userMenuItems.unshift({ text: 'Quản trị', path: '/admin', icon: <DashboardIcon /> });
  }
  
  // Nội dung của drawer trên mobile
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Avatar 
              src={user?.avatarUrl}
              alt={user?.fullName}
              sx={{ width: 80, height: 80, mb: 1 }}
            />
            <Typography variant="h6">{user?.fullName}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
          </>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <LoginIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Đăng nhập để đặt đồ ăn
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                fullWidth 
                component={RouterLink} 
                to="/login"
              >
                Đăng nhập
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                component={RouterLink} 
                to="/signup"
              >
                Đăng ký
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      <List>
        {mainMenuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      {isAuthenticated && (
        <>
          <Divider />
          <List>
            {userMenuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={RouterLink} 
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RestaurantIcon sx={{ mr: 1 }} />
            FoodDelivery
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {mainMenuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color={location.pathname === item.path ? 'primary' : 'inherit'}
                  sx={{ my: 2 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Cart Button */}
            <IconButton color="inherit" component={RouterLink} to="/cart">
              <Badge badgeContent={3} color="error">
                <CartIcon />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <Badge badgeContent={5} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* User Menu */}
                <IconButton
                  onClick={handleMenuOpen}
                  color="inherit"
                  sx={{ ml: 1 }}
                  aria-label="user account"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  <Avatar 
                    src={user?.avatarUrl} 
                    alt={user?.fullName}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5, width: 220 },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {user?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  {userMenuItems.map((item) => (
                    <MenuItem 
                      key={item.text} 
                      onClick={() => handleMenuItemClick(item.path)}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <Typography variant="body2">{item.text}</Typography>
                    </MenuItem>
                  ))}
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <Typography variant="body2">Đăng xuất</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Authentication buttons for desktop
              !isMobile && (
                <Box sx={{ ml: 2 }}>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/signup"
                  >
                    Đăng ký
                  </Button>
                </Box>
              )
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Header; 