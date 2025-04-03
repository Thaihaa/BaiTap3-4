var express = require('express');
var router = express.Router();
let reviewController = require('../controllers/reviews');
let restaurantController = require('../controllers/restaurants');
let { check_authentication, check_authorization } = require('../utils/check_auth');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');

// Middleware kiểm tra quyền với đánh giá
async function checkReviewOwnership(req, res, next) {
    try {
        const reviewId = req.params.id;
        const review = await reviewController.getReviewById(reviewId);

        if (!review) {
            return next(new Error("Đánh giá không tồn tại"));
        }

        // Người dùng phải là người đã đánh giá
        const isReviewer = review.user._id.toString() === req.user._id.toString();
        
        // Hoặc người dùng là chủ nhà hàng
        let isRestaurantOwner = false;
        if (review.restaurant) {
            const restaurant = await restaurantController.getRestaurantById(review.restaurant._id);
            if (restaurant && restaurant.owner.toString() === req.user._id.toString()) {
                isRestaurantOwner = true;
            }
        }

        if (!isReviewer && !isRestaurantOwner) {
            return next(new Error("Bạn không có quyền thực hiện thao tác này"));
        }

        req.review = review;
        req.isReviewer = isReviewer;
        req.isRestaurantOwner = isRestaurantOwner;
        next();
    } catch (error) {
        next(error);
    }
}

// Lấy tất cả đánh giá của người dùng hiện tại
router.get('/my-reviews', check_authentication, async function(req, res, next) {
    try {
        const reviews = await reviewController.getReviewsByUser(req.user._id);
        CreateSuccessRes(res, 200, reviews);
    } catch (error) {
        next(error);
    }
});

// Lấy tất cả đánh giá của một nhà hàng
router.get('/restaurant/:restaurantId', async function(req, res, next) {
    try {
        const reviews = await reviewController.getReviewsByRestaurant(req.params.restaurantId);
        CreateSuccessRes(res, 200, reviews);
    } catch (error) {
        next(error);
    }
});

// Lấy phân tích đánh giá của một nhà hàng
router.get('/analytics/:restaurantId', async function(req, res, next) {
    try {
        const analytics = await reviewController.getReviewsAnalytics(req.params.restaurantId);
        CreateSuccessRes(res, 200, analytics);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết đánh giá
router.get('/:id', async function(req, res, next) {
    try {
        const review = await reviewController.getReviewById(req.params.id);
        if (!review) {
            return next(new Error("Đánh giá không tồn tại"));
        }
        CreateSuccessRes(res, 200, review);
    } catch (error) {
        next(error);
    }
});

// Tạo đánh giá mới
router.post('/', check_authentication, async function(req, res, next) {
    try {
        // Tự động gán ID người dùng hiện tại là người đánh giá
        const reviewData = {
            ...req.body,
            user: req.user._id
        };
        
        const newReview = await reviewController.createReview(reviewData);
        CreateSuccessRes(res, 201, newReview);
    } catch (error) {
        next(error);
    }
});

// Cập nhật đánh giá (chỉ người đánh giá mới có quyền)
router.put('/:id', check_authentication, checkReviewOwnership, async function(req, res, next) {
    try {
        // Chỉ người đánh giá mới có thể cập nhật đánh giá
        if (!req.isReviewer) {
            return next(new Error("Bạn không có quyền cập nhật đánh giá này"));
        }
        
        const updatedReview = await reviewController.updateReview(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedReview);
    } catch (error) {
        next(error);
    }
});

// Xóa đánh giá (người đánh giá hoặc chủ nhà hàng có quyền)
router.delete('/:id', check_authentication, checkReviewOwnership, async function(req, res, next) {
    try {
        const deletedReview = await reviewController.softDeleteReview(req.params.id);
        CreateSuccessRes(res, 200, { message: "Đánh giá đã được xóa", review: deletedReview });
    } catch (error) {
        next(error);
    }
});

// Phản hồi đánh giá (chỉ chủ nhà hàng mới có quyền)
router.post('/:id/response', check_authentication, checkReviewOwnership, async function(req, res, next) {
    try {
        // Chỉ chủ nhà hàng mới có thể phản hồi đánh giá
        if (!req.isRestaurantOwner) {
            return next(new Error("Bạn không có quyền phản hồi đánh giá này"));
        }
        
        const { content } = req.body;
        if (!content) {
            return next(new Error("Nội dung phản hồi không được để trống"));
        }
        
        const updatedReview = await reviewController.respondToReview(req.params.id, { content });
        CreateSuccessRes(res, 200, updatedReview);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 