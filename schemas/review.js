let mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    order: {
        type: mongoose.Types.ObjectId,
        ref: 'order'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ""
    },
    foodRating: {
        type: Number,
        min: 1,
        max: 5
    },
    serviceRating: {
        type: Number,
        min: 1,
        max: 5
    },
    ambienceRating: {
        type: Number,
        min: 1,
        max: 5
    },
    valueRating: {
        type: Number,
        min: 1,
        max: 5
    },
    photos: [{
        type: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    response: {
        text: String,
        createdAt: Date,
        updatedAt: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('review', reviewSchema); 