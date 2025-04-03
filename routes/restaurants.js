var express = require('express');
var router = express.Router();
let restaurantController = require('../controllers/restaurants');
let menuController = require('../controllers/menus');
let orderController = require('../controllers/orders');
let reservationController = require('../controllers/reservations');
let reviewController = require('../controllers/reviews');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let { validate, restaurantValidation } = require('../utils/validator');

// Middleware để kiểm tra quyền sở hữu nhà hàng
async function checkRestaurantOwnership(req, res, next) {
    try {
        const restaurantId = req.params.id;
        const restaurant = await restaurantController.getRestaurantById(restaurantId);

        if (!restaurant) {
            return next(new Error("Nhà hàng không tồn tại"));
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return next(new Error("Bạn không có quyền thực hiện thao tác này"));
        }

        req.restaurant = restaurant;
        next();
    } catch (error) {
        next(error);
    }
}

// Lấy danh sách tất cả nhà hàng
router.get('/', async function(req, res, next) {
    try {
        const restaurants = await restaurantController.getAllRestaurants();
        CreateSuccessRes(res, 200, restaurants);
    } catch (error) {
        next(error);
    }
});

// Tìm kiếm nhà hàng
router.get('/search', async function(req, res, next) {
    try {
        const searchTerm = req.query.q || '';
        const restaurants = await restaurantController.searchRestaurants(searchTerm);
        CreateSuccessRes(res, 200, restaurants);
    } catch (error) {
        next(error);
    }
});

// Lọc nhà hàng theo tiêu chí
router.get('/filter', async function(req, res, next) {
    try {
        const filters = {
            cuisineType: req.query.cuisine,
            priceRange: req.query.price
        };
        const restaurants = await restaurantController.filterRestaurants(filters);
        CreateSuccessRes(res, 200, restaurants);
    } catch (error) {
        next(error);
    }
});

// Lấy thông tin một nhà hàng
router.get('/:id', async function(req, res, next) {
    try {
        const restaurant = await restaurantController.getRestaurantById(req.params.id);
        if (!restaurant) {
            return next(new Error("Nhà hàng không tồn tại"));
        }
        CreateSuccessRes(res, 200, restaurant);
    } catch (error) {
        next(error);
    }
});

// Tạo nhà hàng mới (yêu cầu đăng nhập)
router.post('/', check_authentication, restaurantValidation, validate, async function(req, res, next) {
    try {
        const restaurantData = {
            ...req.body,
            owner: req.user._id
        };
        
        const newRestaurant = await restaurantController.createRestaurant(restaurantData);
        CreateSuccessRes(res, 201, newRestaurant);
    } catch (error) {
        next(error);
    }
});

// Cập nhật thông tin nhà hàng (yêu cầu quyền sở hữu)
router.put('/:id', check_authentication, checkRestaurantOwnership, async function(req, res, next) {
    try {
        const allowedFields = ['name', 'address', 'phone', 'email', 'openingHours', 'description', 'imageUrl', 'cuisineType', 'priceRange', 'status'];
        
        // Lọc chỉ các trường được phép cập nhật
        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        
        const updatedRestaurant = await restaurantController.updateRestaurant(req.params.id, updateData);
        CreateSuccessRes(res, 200, updatedRestaurant);
    } catch (error) {
        next(error);
    }
});

// Xóa nhà hàng (yêu cầu quyền sở hữu)
router.delete('/:id', check_authentication, checkRestaurantOwnership, async function(req, res, next) {
    try {
        const deletedRestaurant = await restaurantController.softDeleteRestaurant(req.params.id);
        CreateSuccessRes(res, 200, { message: "Nhà hàng đã được xóa", restaurant: deletedRestaurant });
    } catch (error) {
        next(error);
    }
});

// Lấy danh sách các nhà hàng của người dùng đang đăng nhập
router.get('/user/my-restaurants', check_authentication, async function(req, res, next) {
    try {
        const restaurants = await restaurantController.getRestaurantsByOwner(req.user._id);
        CreateSuccessRes(res, 200, restaurants);
    } catch (error) {
        next(error);
    }
});

// Lấy menu của nhà hàng
router.get('/:id/menu', async function(req, res, next) {
    try {
        const menuItems = await menuController.getMenuByRestaurant(req.params.id);
        CreateSuccessRes(res, 200, menuItems);
    } catch (error) {
        next(error);
    }
});

// Lấy đơn hàng của nhà hàng (yêu cầu quyền sở hữu)
router.get('/:id/orders', check_authentication, checkRestaurantOwnership, async function(req, res, next) {
    try {
        const status = req.query.status; // Có thể lọc theo trạng thái
        
        let orders;
        if (status) {
            orders = await orderController.filterOrdersByStatus(req.params.id, status);
        } else {
            orders = await orderController.getOrdersByRestaurant(req.params.id);
        }
        
        CreateSuccessRes(res, 200, orders);
    } catch (error) {
        next(error);
    }
});

// Lấy đặt bàn của nhà hàng (yêu cầu quyền sở hữu)
router.get('/:id/reservations', check_authentication, checkRestaurantOwnership, async function(req, res, next) {
    try {
        const status = req.query.status; // Có thể lọc theo trạng thái
        const date = req.query.date; // Có thể lọc theo ngày
        
        const reservations = await reservationController.getReservationsByRestaurant(
            req.params.id, 
            { status, date }
        );
        
        CreateSuccessRes(res, 200, reservations);
    } catch (error) {
        next(error);
    }
});

// Lấy đánh giá của nhà hàng
router.get('/:id/reviews', async function(req, res, next) {
    try {
        const reviews = await reviewController.getReviewsByRestaurant(req.params.id);
        CreateSuccessRes(res, 200, reviews);
    } catch (error) {
        next(error);
    }
});

// Lấy thống kê doanh thu nhà hàng (yêu cầu quyền sở hữu)
router.get('/:id/stats', check_authentication, checkRestaurantOwnership, async function(req, res, next) {
    try {
        const startDate = req.query.start || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]; // Mặc định 30 ngày trước
        const endDate = req.query.end || new Date().toISOString().split('T')[0]; // Mặc định ngày hiện tại
        
        const stats = await orderController.getOrderStatsByDate(req.params.id, startDate, endDate);
        CreateSuccessRes(res, 200, stats);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 