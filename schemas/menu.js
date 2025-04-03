let mongoose = require('mongoose');

let menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isSpecial: {
        type: Boolean,
        default: false
    },
    discountPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    preparationTime: {
        type: Number, // Thời gian chuẩn bị (phút)
        default: 15
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Tính giá sau khi giảm giá
menuItemSchema.virtual('discountedPrice').get(function() {
    return this.price - (this.price * this.discountPercent / 100);
});

// Đảm bảo virtuals được đưa vào khi chuyển đổi sang JSON
menuItemSchema.set('toJSON', { virtuals: true });
menuItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('menuItem', menuItemSchema); 