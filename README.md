# Hệ thống Quản lý Nhà hàng - Restaurant Management System

Hệ thống quản lý nhà hàng toàn diện được xây dựng với Node.js, Express và MongoDB. Hệ thống này hỗ trợ quản lý nhà hàng, menu, đơn hàng, đặt bàn và đánh giá.

## Tính năng

### Quản lý người dùng
- Đăng ký, đăng nhập và đăng xuất
- Quên mật khẩu và đặt lại mật khẩu
- Phân quyền người dùng (Admin, Chủ nhà hàng, Khách hàng)
- Xác thực và ủy quyền với JWT

### Quản lý nhà hàng
- Tạo, đọc, cập nhật và xóa nhà hàng
- Tìm kiếm và lọc nhà hàng
- Quản lý thông tin chi tiết nhà hàng (địa chỉ, giờ mở cửa, liên hệ)

### Quản lý menu
- Thêm, cập nhật và xóa món ăn
- Phân loại món ăn theo danh mục
- Quản lý giá và khuyến mãi
- Món ăn đặc biệt và tính khả dụng

### Quản lý đơn hàng
- Đặt đơn hàng trực tuyến
- Theo dõi trạng thái đơn hàng
- Xử lý thanh toán
- Thông báo qua email về trạng thái đơn hàng

### Đặt bàn
- Đặt bàn trực tuyến
- Quản lý lịch đặt bàn
- Xác nhận và hủy đặt bàn
- Nhắc nhở tự động

### Đánh giá và phản hồi
- Đánh giá nhà hàng và món ăn
- Xếp hạng và bình luận
- Quản lý phản hồi từ chủ nhà hàng

### Phân tích và báo cáo
- Thống kê doanh thu
- Phân tích đơn hàng và đặt bàn
- Báo cáo hiệu suất

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Cơ sở dữ liệu**: MongoDB với Mongoose
- **Xác thực**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Gửi email**: Nodemailer
- **Bảo mật**: bcrypt để mã hóa mật khẩu

## Cài đặt

1. Clone repository:
```
git clone https://github.com/yourusername/restaurant-management.git
cd restaurant-management
```

2. Cài đặt dependencies:
```
npm install
```

3. Cấu hình biến môi trường:
Tạo file `.env` trong thư mục gốc và thêm các cấu hình cần thiết:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/restaurant-db
JWT_SECRET=your_jwt_secret
```

4. Khởi động server:
```
npm start
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `POST /auth/forgotpassword` - Quên mật khẩu
- `POST /auth/resetpassword/:token` - Đặt lại mật khẩu
- `POST /auth/changepassword` - Thay đổi mật khẩu

### Nhà hàng
- `GET /restaurants` - Lấy danh sách nhà hàng
- `GET /restaurants/:id` - Lấy thông tin nhà hàng
- `POST /restaurants` - Tạo nhà hàng mới
- `PUT /restaurants/:id` - Cập nhật nhà hàng
- `DELETE /restaurants/:id` - Xóa nhà hàng
- `GET /restaurants/search` - Tìm kiếm nhà hàng
- `GET /restaurants/filter` - Lọc nhà hàng

### Menu
- `GET /restaurants/:id/menu` - Lấy menu của nhà hàng
- `POST /menu` - Thêm món ăn vào menu
- `PUT /menu/:id` - Cập nhật món ăn
- `DELETE /menu/:id` - Xóa món ăn

### Đơn hàng
- `POST /orders` - Tạo đơn hàng mới
- `GET /orders/:id` - Lấy thông tin đơn hàng
- `PUT /orders/:id/status` - Cập nhật trạng thái đơn hàng
- `GET /restaurants/:id/orders` - Lấy đơn hàng của nhà hàng

### Đặt bàn
- `POST /reservations` - Đặt bàn mới
- `GET /reservations/:id` - Lấy thông tin đặt bàn
- `PUT /reservations/:id/status` - Cập nhật trạng thái đặt bàn
- `GET /restaurants/:id/reservations` - Lấy đặt bàn của nhà hàng

### Đánh giá
- `POST /reviews` - Tạo đánh giá mới
- `GET /restaurants/:id/reviews` - Lấy đánh giá của nhà hàng
- `PUT /reviews/:id/response` - Thêm phản hồi cho đánh giá

## Đóng góp

Chào mừng mọi đóng góp! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

## Giấy phép

Dự án này được cấp phép theo [GPL-3.0 License](LICENSE). 