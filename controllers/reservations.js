const reservationSchema = require('../schemas/reservation');

module.exports = {
    // Lấy tất cả đặt bàn theo nhà hàng
    getReservationsByRestaurant: async (restaurantId, filters = {}) => {
        let query = { restaurant: restaurantId };
        
        // Thêm bộ lọc theo trạng thái
        if (filters.status) {
            query.status = filters.status;
        }
        
        // Thêm bộ lọc theo ngày
        if (filters.date) {
            const startDate = new Date(filters.date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(filters.date);
            endDate.setHours(23, 59, 59, 999);
            
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        return await reservationSchema.find(query)
            .populate('customer', 'username email fullName phone')
            .sort({ date: 1, time: 1 });
    },
    
    // Lấy tất cả đặt bàn của khách hàng
    getReservationsByCustomer: async (customerId) => {
        return await reservationSchema.find({
            customer: customerId
        })
        .populate('restaurant', 'name address phone')
        .sort({ date: -1 });
    },
    
    // Lấy chi tiết đặt bàn theo ID
    getReservationById: async (id) => {
        return await reservationSchema.findById(id)
            .populate('customer', 'username email fullName phone')
            .populate('restaurant', 'name address phone email');
    },
    
    // Tạo đặt bàn mới
    createReservation: async (data) => {
        // Kiểm tra xem đã có đặt bàn vào thời gian này chưa
        const existingReservation = await reservationSchema.findOne({
            restaurant: data.restaurant,
            date: data.date,
            time: data.time,
            status: { $nin: ['cancelled', 'completed'] }
        });
        
        if (existingReservation) {
            throw new Error('Thời gian này đã có người đặt. Vui lòng chọn thời gian khác');
        }
        
        const newReservation = new reservationSchema(data);
        return await newReservation.save();
    },
    
    // Cập nhật trạng thái đặt bàn
    updateReservationStatus: async (id, status) => {
        return await reservationSchema.findByIdAndUpdate(
            id,
            { 
                status: status,
                ...(status === 'completed' || status === 'cancelled' ? { completedAt: new Date() } : {})
            },
            { new: true }
        );
    },
    
    // Cập nhật thông tin đặt bàn
    updateReservation: async (id, data) => {
        // Chỉ cho phép cập nhật một số trường
        const allowedFields = ['date', 'time', 'partySize', 'specialRequests', 'status'];
        
        const updateData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });
        
        return await reservationSchema.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
    },
    
    // Hủy đặt bàn
    cancelReservation: async (id, reason) => {
        return await reservationSchema.findByIdAndUpdate(
            id,
            { 
                status: 'cancelled',
                completedAt: new Date(),
                specialRequests: reason ? `Lý do hủy: ${reason}` : 'Không có lý do'
            },
            { new: true }
        );
    },
    
    // Lấy số lượng đặt bàn theo ngày
    getReservationCountByDate: async (restaurantId, date) => {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        return await reservationSchema.countDocuments({
            restaurant: restaurantId,
            date: { $gte: startDate, $lte: endDate },
            status: { $nin: ['cancelled', 'no_show'] }
        });
    },
    
    // Kiểm tra xem thời gian đặt bàn đã có người đặt chưa
    checkTimeAvailability: async (restaurantId, date, time) => {
        const count = await reservationSchema.countDocuments({
            restaurant: restaurantId,
            date: date,
            time: time,
            status: { $nin: ['cancelled', 'completed', 'no_show'] }
        });
        
        return count === 0;
    }
}; 