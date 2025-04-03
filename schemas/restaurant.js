let mongoose = require('mongoose');

let restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    openingHours: {
        type: String,
        default: "08:00 - 22:00"
    },
    description: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    cuisineType: {
        type: String,
        default: "Việt Nam"
    },
    priceRange: {
        type: String,
        enum: ['$', '$$', '$$$', '$$$$'],
        default: '$$'
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('restaurant', restaurantSchema); 