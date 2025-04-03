let mongoose = require('mongoose');

let reservationSchema = new mongoose.Schema({
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
    reservationNumber: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    partySize: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        default: ""
    },
    tableNumber: {
        type: String,
        default: ""
    },
    duration: {
        type: Number,
        default: 120 // Thời gian đặt bàn mặc định: 120 phút
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    cancelReason: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Tạo reservationNumber tự động trước khi lưu
reservationSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }
    
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('reservation').countDocuments({
        createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
    });
    
    this.reservationNumber = `RES-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    next();
});

module.exports = mongoose.model('reservation', reservationSchema); 