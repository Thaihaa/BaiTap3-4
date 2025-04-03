var express = require('express');
var router = express.Router();
let orderController = require('../controllers/orders');
let restaurantController = require('../controllers/restaurants');
let { check_authentication, check_authorization } = require('../utils/check_auth');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');

// Middleware kiểm tra quyền với đơn hàng
async function checkOrderOwnership(req, res, next) {
    try {
        const orderId = req.params.id;
        const order = await orderController.getOrderById(orderId);

        if (!order) {
            return next(new Error("Đơn hàng không tồn tại"));
        }

        // Người dùng phải là chủ nhà hàng hoặc là khách hàng đặt hàng
        const isCustomer = order.customer._id.toString() === req.user._id.toString();
        
        let isRestaurantOwner = false;
        if (order.restaurant) {
            const restaurant = await restaurantController.getRestaurantById(order.restaurant._id);
            if (restaurant && restaurant.owner.toString() === req.user._id.toString()) {
                isRestaurantOwner = true;
            }
        }

        if (!isCustomer && !isRestaurantOwner) {
            return next(new Error("Bạn không có quyền thực hiện thao tác này"));
        }

        req.order = order;
        req.isCustomer = isCustomer;
        req.isRestaurantOwner = isRestaurantOwner;
        next();
    } catch (error) {
        next(error);
    }
}

// Lấy tất cả đơn hàng của người dùng hiện tại
router.get('/my-orders', check_authentication, async function(req, res, next) {
    try {
        const orders = await orderController.getOrdersByCustomer(req.user._id);
        CreateSuccessRes(res, 200, orders);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết đơn hàng
router.get('/:id', check_authentication, checkOrderOwnership, async function(req, res, next) {
    try {
        // req.order đã được gán trong middleware checkOrderOwnership
        CreateSuccessRes(res, 200, req.order);
    } catch (error) {
        next(error);
    }
});

// Tạo đơn hàng mới
router.post('/', check_authentication, async function(req, res, next) {
    try {
        // Tự động gán ID người dùng hiện tại là khách hàng
        const orderData = {
            ...req.body,
            customer: req.user._id
        };
        
        const newOrder = await orderController.createOrder(orderData);
        CreateSuccessRes(res, 201, newOrder);
    } catch (error) {
        next(error);
    }
});

// Cập nhật trạng thái đơn hàng (chỉ chủ nhà hàng mới có quyền)
router.put('/:id/status', check_authentication, checkOrderOwnership, async function(req, res, next) {
    try {
        // Chỉ chủ nhà hàng mới có thể cập nhật trạng thái đơn hàng
        if (!req.isRestaurantOwner) {
            return next(new Error("Bạn không có quyền cập nhật trạng thái đơn hàng"));
        }
        
        const { status } = req.body;
        if (!status) {
            return next(new Error("Trạng thái đơn hàng không được để trống"));
        }
        
        const updatedOrder = await orderController.updateOrderStatus(req.params.id, status);
        CreateSuccessRes(res, 200, updatedOrder);
    } catch (error) {
        next(error);
    }
});

// Cập nhật trạng thái thanh toán
router.put('/:id/payment', check_authentication, checkOrderOwnership, async function(req, res, next) {
    try {
        // Chỉ chủ nhà hàng mới có thể cập nhật trạng thái thanh toán
        if (!req.isRestaurantOwner) {
            return next(new Error("Bạn không có quyền cập nhật trạng thái thanh toán"));
        }
        
        const { paymentStatus } = req.body;
        if (!paymentStatus) {
            return next(new Error("Trạng thái thanh toán không được để trống"));
        }
        
        const updatedOrder = await orderController.updatePaymentStatus(req.params.id, paymentStatus);
        CreateSuccessRes(res, 200, updatedOrder);
    } catch (error) {
        next(error);
    }
});

// Hủy đơn hàng
router.put('/:id/cancel', check_authentication, checkOrderOwnership, async function(req, res, next) {
    try {
        const { reason } = req.body;
        
        // Khách hàng chỉ có thể hủy đơn hàng ở trạng thái 'pending' hoặc 'confirmed'
        if (req.isCustomer && !['pending', 'confirmed'].includes(req.order.status)) {
            return next(new Error("Không thể hủy đơn hàng ở trạng thái này"));
        }
        
        const cancelledOrder = await orderController.cancelOrder(req.params.id, reason);
        CreateSuccessRes(res, 200, cancelledOrder);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 