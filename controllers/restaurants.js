var restaurantSchema = require('../schemas/restaurant');

module.exports = {
    // Lấy tất cả nhà hàng có trạng thái active
    getAllRestaurants: async () => {
        return await restaurantSchema.find({
            status: 'active',
            isDeleted: false
        }).populate('owner', 'username email fullName');
    },
    
    // Lấy thông tin nhà hàng theo ID
    getRestaurantById: async (id) => {
        return await restaurantSchema.findOne({
            _id: id,
            isDeleted: false
        }).populate('owner', 'username email fullName');
    },
    
    // Lấy nhà hàng theo chủ sở hữu
    getRestaurantsByOwner: async (ownerId) => {
        return await restaurantSchema.find({
            owner: ownerId,
            isDeleted: false
        }).populate('owner', 'username email fullName');
    },
    
    // Tìm kiếm nhà hàng
    searchRestaurants: async (searchTerm) => {
        return await restaurantSchema.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { cuisineType: { $regex: searchTerm, $options: 'i' } },
                { address: { $regex: searchTerm, $options: 'i' } }
            ],
            status: 'active',
            isDeleted: false
        }).populate('owner', 'username email fullName');
    },
    
    // Tạo nhà hàng mới
    createRestaurant: async (data) => {
        const newRestaurant = new restaurantSchema(data);
        return await newRestaurant.save();
    },
    
    // Cập nhật thông tin nhà hàng
    updateRestaurant: async (id, data) => {
        return await restaurantSchema.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
    },
    
    // Xóa mềm nhà hàng
    softDeleteRestaurant: async (id) => {
        return await restaurantSchema.findByIdAndUpdate(
            id,
            { 
                isDeleted: true,
                status: 'inactive'
            },
            { new: true }
        );
    },
    
    // Lọc nhà hàng theo tiêu chí
    filterRestaurants: async (filters) => {
        let query = {
            status: 'active',
            isDeleted: false
        };
        
        if (filters.cuisineType) {
            query.cuisineType = filters.cuisineType;
        }
        
        if (filters.priceRange) {
            query.priceRange = filters.priceRange;
        }
        
        return await restaurantSchema.find(query)
            .populate('owner', 'username email fullName');
    }
}; 