import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ToastContainer from '../common/ToastContainer';

/**
 * Layout component bao bọc toàn bộ ứng dụng
 * Chứa Header, Footer và ToastContainer
 */
const Layout = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
      
      {/* Footer */}
      <Footer />
      
      {/* Toast notifications */}
      <ToastContainer />
    </Box>
  );
};

export default Layout; 