let mongoose = require('mongoose');

// Schema cho món ăn trong đơn hàng
const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Types.ObjectId,
        ref: 'menuItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    note: {
        type: String,
        default: ""
    },
    discount: {
        type: Number,
        default: 0
    }
});

// Schema cho đơn hàng
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
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
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'momo', 'zalopay', 'banking'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String,
        default: ""
    },
    deliveryMethod: {
        type: String,
        enum: ['pickup', 'delivery'],
        default: 'pickup'
    },
    specialRequests: {
        type: String,
        default: ""
    },
    estimatedDeliveryTime: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Tạo orderNumber tự động trước khi lưu
orderSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }
    
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('order').countDocuments({
        createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
    });
    
    this.orderNumber = `ORD-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    next();
});

module.exports = mongoose.model('order', orderSchema); 