const slugify = require('slugify');
const productSchema = require('../schemas/product');
const categorySchema = require('../schemas/category');

const generateSlug = (text) => {
    return slugify(text, {
        lower: true,        // chuyển thành chữ thường
        strict: true,       // loại bỏ các ký tự đặc biệt
        locale: 'vi',       // hỗ trợ tiếng Việt
        remove: /[*+~.()'"!:@]/g // các ký tự cần loại bỏ
    });
};

module.exports = {
    // Lấy sản phẩm theo slug
    getProductBySlug: async (slug) => {
        return await productSchema.findOne({
            slug: slug,
            isDeleted: false
        });
    },

    // Lấy danh mục theo slug
    getCategoryBySlug: async (slug) => {
        return await categorySchema.findOne({
            slug: slug,
            isDeleted: false
        });
    },

    // Lấy tất cả sản phẩm của danh mục theo slug
    getProductsByCategorySlug: async (categorySlug) => {
        // Tìm danh mục theo slug
        const category = await categorySchema.findOne({
            slug: categorySlug,
            isDeleted: false
        });

        if (!category) {
            return [];
        }

        // Lấy tất cả sản phẩm thuộc danh mục này
        return await productSchema.find({
            category: category._id,
            isDeleted: false
        });
    },

    // Tạo slug cho sản phẩm
    generateProductSlug: async (name) => {
        let slug = generateSlug(name);
        
        // Kiểm tra xem slug đã tồn tại chưa
        const existingProduct = await productSchema.findOne({ slug });
        
        // Nếu slug đã tồn tại, thêm một chuỗi ngẫu nhiên để tạo slug mới
        if (existingProduct) {
            const randomString = Math.random().toString(36).substring(2, 7);
            slug = `${slug}-${randomString}`;
        }
        
        return slug;
    },

    // Tạo slug cho danh mục
    generateCategorySlug: async (name) => {
        let slug = generateSlug(name);
        
        // Kiểm tra xem slug đã tồn tại chưa
        const existingCategory = await categorySchema.findOne({ slug });
        
        // Nếu slug đã tồn tại, thêm một chuỗi ngẫu nhiên để tạo slug mới
        if (existingCategory) {
            const randomString = Math.random().toString(36).substring(2, 7);
            slug = `${slug}-${randomString}`;
        }
        
        return slug;
    }
};