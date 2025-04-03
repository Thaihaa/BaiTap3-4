var express = require('express');
var router = express.Router();
let reservationController = require('../controllers/reservations');
let restaurantController = require('../controllers/restaurants');
let { check_authentication, check_authorization } = require('../utils/check_auth');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');

// Middleware kiểm tra quyền với đặt bàn
async function checkReservationOwnership(req, res, next) {
    try {
        const reservationId = req.params.id;
        const reservation = await reservationController.getReservationById(reservationId);

        if (!reservation) {
            return next(new Error("Đặt bàn không tồn tại"));
        }

        // Người dùng phải là chủ nhà hàng hoặc là khách hàng đặt bàn
        const isCustomer = reservation.customer._id.toString() === req.user._id.toString();
        
        let isRestaurantOwner = false;
        if (reservation.restaurant) {
            const restaurant = await restaurantController.getRestaurantById(reservation.restaurant._id);
            if (restaurant && restaurant.owner.toString() === req.user._id.toString()) {
                isRestaurantOwner = true;
            }
        }

        if (!isCustomer && !isRestaurantOwner) {
            return next(new Error("Bạn không có quyền thực hiện thao tác này"));
        }

        req.reservation = reservation;
        req.isCustomer = isCustomer;
        req.isRestaurantOwner = isRestaurantOwner;
        next();
    } catch (error) {
        next(error);
    }
}

// Lấy tất cả đặt bàn của người dùng hiện tại
router.get('/my-reservations', check_authentication, async function(req, res, next) {
    try {
        const reservations = await reservationController.getReservationsByCustomer(req.user._id);
        CreateSuccessRes(res, 200, reservations);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết đặt bàn
router.get('/:id', check_authentication, checkReservationOwnership, async function(req, res, next) {
    try {
        // req.reservation đã được gán trong middleware checkReservationOwnership
        CreateSuccessRes(res, 200, req.reservation);
    } catch (error) {
        next(error);
    }
});

// Tạo đặt bàn mới
router.post('/', check_authentication, async function(req, res, next) {
    try {
        // Tự động gán ID người dùng hiện tại là khách hàng
        const reservationData = {
            ...req.body,
            customer: req.user._id
        };
        
        const newReservation = await reservationController.createReservation(reservationData);
        CreateSuccessRes(res, 201, newReservation);
    } catch (error) {
        next(error);
    }
});

// Cập nhật trạng thái đặt bàn (chỉ chủ nhà hàng mới có quyền)
router.put('/:id/status', check_authentication, checkReservationOwnership, async function(req, res, next) {
    try {
        // Chỉ chủ nhà hàng mới có thể cập nhật trạng thái đặt bàn
        if (!req.isRestaurantOwner) {
            return next(new Error("Bạn không có quyền cập nhật trạng thái đặt bàn"));
        }
        
        const { status } = req.body;
        if (!status) {
            return next(new Error("Trạng thái đặt bàn không được để trống"));
        }
        
        const updatedReservation = await reservationController.updateReservationStatus(req.params.id, status);
        CreateSuccessRes(res, 200, updatedReservation);
    } catch (error) {
        next(error);
    }
});

// Cập nhật thông tin đặt bàn
router.put('/:id', check_authentication, checkReservationOwnership, async function(req, res, next) {
    try {
        // Khách hàng chỉ có thể cập nhật đặt bàn ở trạng thái 'pending'
        if (req.isCustomer && req.reservation.status !== 'pending') {
            return next(new Error("Không thể cập nhật đặt bàn ở trạng thái này"));
        }
        
        const updatedReservation = await reservationController.updateReservation(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedReservation);
    } catch (error) {
        next(error);
    }
});

// Hủy đặt bàn
router.put('/:id/cancel', check_authentication, checkReservationOwnership, async function(req, res, next) {
    try {
        const { reason } = req.body;
        
        // Khách hàng chỉ có thể hủy đặt bàn ở trạng thái 'pending' hoặc 'confirmed'
        if (req.isCustomer && !['pending', 'confirmed'].includes(req.reservation.status)) {
            return next(new Error("Không thể hủy đặt bàn ở trạng thái này"));
        }
        
        const cancelledReservation = await reservationController.cancelReservation(req.params.id, reason);
        CreateSuccessRes(res, 200, cancelledReservation);
    } catch (error) {
        next(error);
    }
});

// Kiểm tra thời gian đặt bàn có khả dụng không
router.get('/availability/:restaurantId', async function(req, res, next) {
    try {
        const { date, time } = req.query;
        
        if (!date || !time) {
            return next(new Error("Vui lòng cung cấp ngày và giờ để kiểm tra"));
        }
        
        const isAvailable = await reservationController.checkTimeAvailability(req.params.restaurantId, date, time);
        CreateSuccessRes(res, 200, { isAvailable });
    } catch (error) {
        next(error);
    }
});

module.exports = router; 