import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Chip,
  Rating,
  InputAdornment,
  TextField,
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { restaurantService } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';
import { truncateText } from '../utils/helpers';

// Component chính trang Home
const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToastContext();

  // Lấy danh sách nhà hàng khi component được mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Hàm lấy dữ liệu nhà hàng
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await restaurantService.getAllRestaurants();
      if (response.success) {
        setRestaurants(response.data);
      } else {
        toast.error('Không thể tải danh sách nhà hàng');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải danh sách nhà hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    // Chuyển hướng đến trang tìm kiếm với query
    window.location.href = `/search?q=${searchQuery}`;
  };

  return (
    <Box>
      {/* Banner chính */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 3
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Đặt đồ ăn ngon, giao tận nơi
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4 }}>
                Tìm kiếm và đặt món từ những nhà hàng ngon nhất tại địa phương của bạn
              </Typography>
              
              {/* Form tìm kiếm */}
              <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', mb: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Tìm nhà hàng hoặc món ăn yêu thích..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: { 
                      bgcolor: 'white', 
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      }
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ ml: 1, px: 3 }}
                >
                  Tìm
                </Button>
              </Box>
              
              {/* Các tùy chọn nhanh */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="Gần tôi" 
                  clickable 
                  color="default" 
                  icon={<LocationIcon />} 
                  sx={{ bgcolor: 'white' }}
                  component={Link}
                  to="/restaurants?near=true"
                />
                <Chip 
                  label="Đồ ăn nhanh" 
                  clickable 
                  color="default" 
                  sx={{ bgcolor: 'white' }}
                  component={Link}
                  to="/restaurants?category=fast-food"
                />
                <Chip 
                  label="Món Việt" 
                  clickable 
                  color="default" 
                  sx={{ bgcolor: 'white' }}
                  component={Link}
                  to="/restaurants?cuisine=vietnamese"
                />
                <Chip 
                  label="Pizza" 
                  clickable 
                  color="default" 
                  sx={{ bgcolor: 'white' }}
                  component={Link}
                  to="/restaurants?cuisine=pizza"
                />
              </Box>
            </Grid>
            
            {/* Hình ảnh banner */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Food delivery"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: 8,
                  transform: 'rotate(2deg)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Nhà hàng nổi bật */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2">
              Nhà hàng nổi bật
            </Typography>
            <Button 
              component={Link} 
              to="/restaurants" 
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              Xem tất cả
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {restaurants.slice(0, 8).map((restaurant) => (
                <Grid item xs={12} sm={6} md={3} key={restaurant._id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Danh mục ẩm thực */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
            Khám phá theo danh mục
          </Typography>
          
          <Grid container spacing={2}>
            {cuisineCategories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Card 
                  component={Link}
                  to={`/restaurants?cuisine=${category.id}`}
                  sx={{ 
                    height: 160, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={category.image}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: '50%',
                      mb: 1
                    }}
                    alt={category.name}
                  />
                  <Typography variant="subtitle1" color="text.primary" fontWeight="medium">
                    {category.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Banner quảng cáo */}
        <Box 
          sx={{ 
            bgcolor: 'secondary.light', 
            borderRadius: 2, 
            p: 4, 
            mb: 6,
            backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTI5OTY4OA&ixlib=rb-4.0.3&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 2,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, color: 'white', maxWidth: 600 }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Giảm giá 20% cho đơn hàng đầu tiên
            </Typography>
            <Typography variant="body1" paragraph>
              Sử dụng mã WELCOME20 khi thanh toán để được giảm giá 20% cho đơn hàng đầu tiên của bạn
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Đặt ngay
            </Button>
          </Box>
        </Box>

        {/* Tại sao chọn chúng tôi */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Tại sao chọn chúng tôi
          </Typography>
          
          <Grid container spacing={4}>
            {benefits.map((benefit) => (
              <Grid item xs={12} sm={6} md={3} key={benefit.title}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, boxShadow: 2 }}>
                  {benefit.icon}
                  <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {benefit.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

// Card hiển thị thông tin nhà hàng
const RestaurantCard = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Lưu nhà hàng yêu thích vào database
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
          image={restaurant.imageUrl || 'https://via.placeholder.com/300x140?text=Nhà+hàng'}
          alt={restaurant.name}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'white',
            '&:hover': { bgcolor: 'white' },
          }}
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h3" noWrap>
          {restaurant.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={restaurant.averageRating || 0} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({restaurant.reviewCount || 0})
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {restaurant.cuisineType && restaurant.cuisineType.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <LocationIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
          {restaurant.address ? truncateText(restaurant.address, 30) : 'Không có địa chỉ'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTimeIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {restaurant.estimatedDeliveryTime || '30-45'} phút
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          component={Link} 
          to={`/restaurants/${restaurant._id}`} 
          size="small" 
          color="primary"
          sx={{ ml: 'auto' }}
        >
          Xem thực đơn
        </Button>
      </CardActions>
    </Card>
  );
};

// Dữ liệu mẫu cho danh mục ẩm thực
const cuisineCategories = [
  {
    id: 'vietnamese',
    name: 'Món Việt',
    image: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTM5NTY5NQ&ixlib=rb-4.0.3&q=80&w=1080',
  },
  {
    id: 'japanese',
    name: 'Món Nhật',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTM5NTc0MQ&ixlib=rb-4.0.3&q=80&w=1080',
  },
  {
    id: 'korean',
    name: 'Món Hàn',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTM5NTc3OQ&ixlib=rb-4.0.3&q=80&w=1080',
  },
  {
    id: 'chinese',
    name: 'Món Trung',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTM5NTc5NA&ixlib=rb-4.0.3&q=80&w=1080',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTI5OTY4OA&ixlib=rb-4.0.3&q=80&w=1080',
  },
  {
    id: 'burger',
    name: 'Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTM5NTgyNA&ixlib=rb-4.0.3&q=80&w=1080',
  },
];

// Dữ liệu lợi ích khi sử dụng dịch vụ
import { 
  LocalShipping as DeliveryIcon,
  RestaurantMenu as MenuIcon,
  Security as SecurityIcon,
  SupportAgent as SupportIcon
} from '@mui/icons-material';

const benefits = [
  {
    title: 'Giao hàng nhanh chóng',
    description: 'Đồ ăn của bạn sẽ được giao đến tận nơi trong thời gian nhanh nhất.',
    icon: <DeliveryIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Đa dạng lựa chọn',
    description: 'Hàng nghìn nhà hàng và món ăn đa dạng để bạn lựa chọn.',
    icon: <MenuIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Thanh toán an toàn',
    description: 'Các phương thức thanh toán đa dạng và bảo mật tuyệt đối.',
    icon: <SecurityIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc mọi nơi.',
    icon: <SupportIcon fontSize="large" color="primary" />,
  },
];

export default Home; 