var express = require('express');
var router = express.Router();
let slugController = require('../controllers/slug');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');

// Lấy tất cả sản phẩm trong một danh mục theo slug
router.get('/:categorySlug', async function(req, res, next) {
    try {
        const products = await slugController.getProductsByCategorySlug(req.params.categorySlug);
        
        if (!products || products.length === 0) {
            return next(new Error("Không tìm thấy sản phẩm nào trong danh mục này"));
        }
        
        CreateSuccessRes(res, 200, products);
    } catch (error) {
        next(error);
    }
});

// Lấy thông tin chi tiết của một sản phẩm cụ thể theo slug của cả danh mục và sản phẩm
router.get('/:categorySlug/:productSlug', async function(req, res, next) {
    try {
        // Đầu tiên kiểm tra xem danh mục có tồn tại không
        const category = await slugController.getCategoryBySlug(req.params.categorySlug);
        
        if (!category) {
            return next(new Error("Danh mục không tồn tại"));
        }
        
        // Sau đó tìm sản phẩm theo slug
        const product = await slugController.getProductBySlug(req.params.productSlug);
        
        if (!product) {
            return next(new Error("Sản phẩm không tồn tại"));
        }
        
        // Kiểm tra xem sản phẩm có thuộc danh mục này không
        if (product.category.toString() !== category._id.toString()) {
            return next(new Error("Sản phẩm không thuộc danh mục này"));
        }
        
        CreateSuccessRes(res, 200, product);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 