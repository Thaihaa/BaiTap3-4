import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 6, 
          borderRadius: 2, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom 
          color="primary"
          sx={{ 
            fontSize: { xs: '5rem', md: '8rem' },
            fontWeight: 'bold'
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          Trang không tìm thấy
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          paragraph
          sx={{ 
            maxWidth: 500,
            mb: 4
          }}
        >
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          Vui lòng kiểm tra lại URL hoặc quay lại trang chủ.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
          >
            Về trang chủ
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component="a"
            href="mailto:support@example.com"
          >
            Liên hệ hỗ trợ
          </Button>
        </Box>

        <Box
          component="img"
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="404 animation"
          sx={{
            width: '100%',
            maxWidth: 500,
            mt: 5
          }}
        />
      </Paper>
    </Container>
  );
};

export default NotFound; 