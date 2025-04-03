var orderSchema = require('../schemas/order');
var menuItemSchema = require('../schemas/menu');
const mailer = require('../utils/mailer');

module.exports = {
    // Lấy tất cả đơn hàng theo nhà hàng
    getOrdersByRestaurant: async (restaurantId) => {
        return await orderSchema.find({
            restaurant: restaurantId
        })
        .populate('customer', 'username email fullName')
        .sort({ createdAt: -1 });
    },
    
    // Lấy tất cả đơn hàng của khách hàng
    getOrdersByCustomer: async (customerId) => {
        return await orderSchema.find({
            customer: customerId
        })
        .populate('restaurant', 'name address phone')
        .sort({ createdAt: -1 });
    },
    
    // Lấy chi tiết đơn hàng theo ID
    getOrderById: async (id) => {
        return await orderSchema.findById(id)
            .populate('customer', 'username email fullName')
            .populate('restaurant', 'name address phone email')
            .populate('items.menuItem');
    },
    
    // Tạo đơn hàng mới
    createOrder: async (orderData) => {
        // Tính tổng số tiền đơn hàng
        let totalAmount = 0;
        
        // Lấy thông tin chi tiết từng món ăn
        for (let i = 0; i < orderData.items.length; i++) {
            const item = orderData.items[i];
            const menuItem = await menuItemSchema.findById(item.menuItem);
            
            if (!menuItem) {
                throw new Error(`Món ăn với ID ${item.menuItem} không tồn tại`);
            }
            
            if (!menuItem.isAvailable) {
                throw new Error(`Món ăn ${menuItem.name} hiện không có sẵn`);
            }
            
            // Thêm thông tin chi tiết món ăn
            orderData.items[i].name = menuItem.name;
            orderData.items[i].price = menuItem.price;
            orderData.items[i].discount = menuItem.discountPercent;
            
            // Tính giá sau khi giảm giá
            const discountedPrice = menuItem.price - (menuItem.price * menuItem.discountPercent / 100);
            totalAmount += discountedPrice * item.quantity;
        }
        
        // Cập nhật tổng tiền
        orderData.totalAmount = totalAmount;
        
        // Tạo đơn hàng mới
        const newOrder = new orderSchema(orderData);
        const savedOrder = await newOrder.save();
        
        // Gửi email xác nhận đơn hàng
        try {
            await sendOrderConfirmationEmail(savedOrder);
        } catch (error) {
            console.error('Lỗi khi gửi email xác nhận đơn hàng:', error);
        }
        
        return savedOrder;
    },
    
    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: async (id, status) => {
        const updatedOrder = await orderSchema.findByIdAndUpdate(
            id,
            { 
                status: status,
                ...(status === 'delivered' || status === 'cancelled' ? { completedAt: new Date() } : {})
            },
            { new: true }
        ).populate('customer').populate('restaurant');
        
        // Gửi email thông báo khi trạng thái đơn hàng thay đổi
        try {
            await sendOrderStatusUpdateEmail(updatedOrder);
        } catch (error) {
            console.error('Lỗi khi gửi email cập nhật trạng thái đơn hàng:', error);
        }
        
        return updatedOrder;
    },
    
    // Cập nhật trạng thái thanh toán
    updatePaymentStatus: async (id, paymentStatus) => {
        return await orderSchema.findByIdAndUpdate(
            id,
            { paymentStatus: paymentStatus },
            { new: true }
        );
    },
    
    // Hủy đơn hàng
    cancelOrder: async (id, reason) => {
        const cancelledOrder = await orderSchema.findByIdAndUpdate(
            id,
            { 
                status: 'cancelled',
                completedAt: new Date(),
                specialRequests: reason ? `${reason} | ${cancelledOrder.specialRequests}` : cancelledOrder.specialRequests
            },
            { new: true }
        ).populate('customer').populate('restaurant');
        
        // Gửi email thông báo hủy đơn hàng
        try {
            await sendOrderCancellationEmail(cancelledOrder, reason);
        } catch (error) {
            console.error('Lỗi khi gửi email hủy đơn hàng:', error);
        }
        
        return cancelledOrder;
    },
    
    // Lọc đơn hàng theo trạng thái
    filterOrdersByStatus: async (restaurantId, status) => {
        return await orderSchema.find({
            restaurant: restaurantId,
            status: status
        })
        .populate('customer', 'username email fullName')
        .sort({ createdAt: -1 });
    },
    
    // Lấy thống kê đơn hàng theo ngày
    getOrderStatsByDate: async (restaurantId, startDate, endDate) => {
        return await orderSchema.aggregate([
            {
                $match: {
                    restaurant: mongoose.Types.ObjectId(restaurantId),
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
    }
};

// Hàm gửi email xác nhận đơn hàng
async function sendOrderConfirmationEmail(order) {
    const customer = order.customer;
    const restaurant = order.restaurant;
    
    const itemsList = order.items.map(item => 
        `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>`
    ).join('');
    
    await mailer.sendOrderConfirmation(
        customer.email,
        {
            customerName: customer.fullName || customer.username,
            orderNumber: order.orderNumber,
            restaurantName: restaurant.name,
            orderDate: new Date(order.createdAt).toLocaleString(),
            items: itemsList,
            totalAmount: formatCurrency(order.totalAmount),
            paymentMethod: getPaymentMethodText(order.paymentMethod),
            deliveryMethod: order.deliveryMethod === 'pickup' ? 'Tự đến lấy' : 'Giao hàng',
            deliveryAddress: order.deliveryAddress || 'Không có',
            specialRequests: order.specialRequests || 'Không có',
            orderStatus: getOrderStatusText(order.status)
        }
    );
}

// Hàm gửi email cập nhật trạng thái đơn hàng
async function sendOrderStatusUpdateEmail(order) {
    const customer = order.customer;
    
    await mailer.sendOrderStatusUpdate(
        customer.email,
        {
            customerName: customer.fullName || customer.username,
            orderNumber: order.orderNumber,
            restaurantName: order.restaurant.name,
            orderStatus: getOrderStatusText(order.status),
            updateTime: new Date().toLocaleString()
        }
    );
}

// Hàm gửi email hủy đơn hàng
async function sendOrderCancellationEmail(order, reason) {
    const customer = order.customer;
    
    await mailer.sendOrderCancellation(
        customer.email,
        {
            customerName: customer.fullName || customer.username,
            orderNumber: order.orderNumber,
            restaurantName: order.restaurant.name,
            cancellationReason: reason || 'Không rõ lý do',
            cancellationTime: new Date().toLocaleString()
        }
    );
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hàm chuyển đổi mã phương thức thanh toán sang text
function getPaymentMethodText(method) {
    const methods = {
        'cash': 'Tiền mặt',
        'credit_card': 'Thẻ tín dụng',
        'momo': 'Ví MoMo',
        'zalopay': 'ZaloPay',
        'banking': 'Chuyển khoản ngân hàng'
    };
    return methods[method] || method;
}

// Hàm chuyển đổi mã trạng thái đơn hàng sang text
function getOrderStatusText(status) {
    const statuses = {
        'pending': 'Đang chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'preparing': 'Đang chuẩn bị',
        'ready': 'Sẵn sàng giao hoặc lấy',
        'delivered': 'Đã giao hàng',
        'cancelled': 'Đã hủy'
    };
    return statuses[status] || status;
} 