const menuSchema = require('../schemas/menu');

module.exports = {
    // Lấy menu của một nhà hàng
    getMenuByRestaurant: async (restaurantId) => {
        return await menuSchema.find({
            restaurant: restaurantId,
            isDeleted: false
        }).sort({ category: 1, name: 1 });
    },
    
    // Lấy một món ăn theo ID
    getMenuItemById: async (id) => {
        return await menuSchema.findOne({
            _id: id,
            isDeleted: false
        });
    },
    
    // Tạo món ăn mới
    createMenuItem: async (data) => {
        const newItem = new menuSchema(data);
        return await newItem.save();
    },
    
    // Cập nhật thông tin món ăn
    updateMenuItem: async (id, data) => {
        return await menuSchema.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
    },
    
    // Xóa mềm món ăn
    softDeleteMenuItem: async (id) => {
        return await menuSchema.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
    },
    
    // Tìm kiếm món ăn
    searchMenuItems: async (searchTerm, restaurantId) => {
        let query = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ],
            isDeleted: false
        };
        
        if (restaurantId) {
            query.restaurant = restaurantId;
        }
        
        return await menuSchema.find(query);
    },
    
    // Lọc món ăn theo danh mục
    filterMenuByCategory: async (restaurantId, category) => {
        return await menuSchema.find({
            restaurant: restaurantId,
            category: category,
            isDeleted: false
        });
    },
    
    // Lấy danh sách danh mục của một nhà hàng
    getRestaurantCategories: async (restaurantId) => {
        return await menuSchema.distinct('category', {
            restaurant: restaurantId,
            isDeleted: false
        });
    }
}; 