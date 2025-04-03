import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Sử dụng hook useAuth để lấy trạng thái và các phương thức xác thực
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook sử dụng auth context
export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// HOC bảo vệ route riêng tư
export const withAuth = (Component, roles = []) => {
  const WithAuth = (props) => {
    const { user, loading, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    React.useEffect(() => {
      // Nếu đã tải xong và người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      if (!loading && !isAuthenticated) {
        navigate('/login', { 
          state: { 
            from: window.location.pathname,
            message: 'Vui lòng đăng nhập để truy cập trang này'
          } 
        });
      }

      // Nếu đã tải xong, người dùng đã đăng nhập, nhưng không có quyền truy cập
      if (!loading && isAuthenticated && roles.length > 0) {
        const hasRequiredRole = roles.includes(user.role);
        if (!hasRequiredRole) {
          navigate('/', { 
            state: { 
              message: 'Bạn không có quyền truy cập trang này'
            } 
          });
        }
      }
    }, [loading, isAuthenticated, user, navigate]);

    // Hiển thị component nếu người dùng đã đăng nhập và có quyền truy cập
    if (loading) {
      return <div>Đang tải...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };

  return WithAuth;
}; 