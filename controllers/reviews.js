const mongoose = require('mongoose');
const reviewSchema = require('../schemas/review');
const restaurantSchema = require('../schemas/restaurant');

module.exports = {
    // Lấy tất cả đánh giá theo nhà hàng
    getReviewsByRestaurant: async (restaurantId) => {
        return await reviewSchema.find({
            restaurant: restaurantId,
            isDeleted: false
        })
        .populate('user', 'username fullName avatarUrl')
        .sort({ createdAt: -1 });
    },
    
    // Lấy tất cả đánh giá của người dùng
    getReviewsByUser: async (userId) => {
        return await reviewSchema.find({
            user: userId,
            isDeleted: false
        })
        .populate('restaurant', 'name address imageUrl')
        .sort({ createdAt: -1 });
    },
    
    // Lấy chi tiết đánh giá theo ID
    getReviewById: async (id) => {
        return await reviewSchema.findOne({
            _id: id,
            isDeleted: false
        })
        .populate('user', 'username fullName avatarUrl')
        .populate('restaurant', 'name address imageUrl');
    },
    
    // Tạo đánh giá mới
    createReview: async (data) => {
        // Kiểm tra xem người dùng đã đánh giá nhà hàng này chưa
        const existingReview = await reviewSchema.findOne({
            user: data.user,
            restaurant: data.restaurant,
            isDeleted: false
        });
        
        if (existingReview) {
            throw new Error('Bạn đã đánh giá nhà hàng này rồi. Vui lòng chỉnh sửa đánh giá hiện có');
        }
        
        const newReview = new reviewSchema(data);
        const savedReview = await newReview.save();
        
        // Cập nhật điểm đánh giá trung bình của nhà hàng
        await updateRestaurantRating(data.restaurant);
        
        return savedReview;
    },
    
    // Cập nhật đánh giá
    updateReview: async (id, data) => {
        // Chỉ cho phép cập nhật rating và content
        const updatedReview = await reviewSchema.findByIdAndUpdate(
            id,
            { 
                rating: data.rating,
                content: data.content,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        // Cập nhật điểm đánh giá trung bình của nhà hàng
        await updateRestaurantRating(updatedReview.restaurant);
        
        return updatedReview;
    },
    
    // Xóa mềm đánh giá
    softDeleteReview: async (id) => {
        const deletedReview = await reviewSchema.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        
        // Cập nhật điểm đánh giá trung bình của nhà hàng
        await updateRestaurantRating(deletedReview.restaurant);
        
        return deletedReview;
    },
    
    // Phản hồi đánh giá của nhà hàng
    respondToReview: async (id, responseData) => {
        return await reviewSchema.findByIdAndUpdate(
            id,
            { 
                response: {
                    content: responseData.content,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { new: true }
        );
    },
    
    // Lấy phân tích đánh giá cho nhà hàng (phân phối theo số sao)
    getReviewsAnalytics: async (restaurantId) => {
        return await reviewSchema.aggregate([
            {
                $match: {
                    restaurant: mongoose.Types.ObjectId(restaurantId),
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]);
    }
};

// Hàm cập nhật rating trung bình của nhà hàng
async function updateRestaurantRating(restaurantId) {
    // Tính rating trung bình từ tất cả các đánh giá
    const result = await reviewSchema.aggregate([
        {
            $match: {
                restaurant: mongoose.Types.ObjectId(restaurantId),
                isDeleted: false
            }
        },
        {
            $group: {
                _id: null,
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
    
    let avgRating = 0;
    let totalReviews = 0;
    
    if (result.length > 0) {
        avgRating = result[0].avgRating;
        totalReviews = result[0].totalReviews;
    }
    
    // Cập nhật vào schema nhà hàng
    await restaurantSchema.findByIdAndUpdate(
        restaurantId,
        {
            rating: avgRating,
            reviewCount: totalReviews
        }
    );
} 