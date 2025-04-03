var express = require('express');
var router = express.Router();
let menuController = require('../controllers/menus');
let restaurantController = require('../controllers/restaurants');
let { check_authentication, check_authorization } = require('../utils/check_auth');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');

// Middleware kiểm tra quyền sở hữu nhà hàng
async function checkMenuItemOwnership(req, res, next) {
    try {
        const menuItemId = req.params.id;
        const menuItem = await menuController.getMenuItemById(menuItemId);

        if (!menuItem) {
            return next(new Error("Món ăn không tồn tại"));
        }

        // Truy xuất thông tin nhà hàng
        const restaurant = await restaurantController.getRestaurantById(menuItem.restaurant);

        if (!restaurant) {
            return next(new Error("Nhà hàng không tồn tại"));
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return next(new Error("Bạn không có quyền thực hiện thao tác này"));
        }

        req.menuItem = menuItem;
        req.restaurant = restaurant;
        next();
    } catch (error) {
        next(error);
    }
}

// Lấy tất cả món ăn
router.get('/', async function(req, res, next) {
    try {
        const restaurantId = req.query.restaurantId;
        let menuItems;
        
        if (restaurantId) {
            menuItems = await menuController.getMenuByRestaurant(restaurantId);
        } else {
            // Nếu không có restaurantId, trả về lỗi
            return next(new Error("Vui lòng cung cấp ID nhà hàng"));
        }
        
        CreateSuccessRes(res, 200, menuItems);
    } catch (error) {
        next(error);
    }
});

// Tìm kiếm món ăn
router.get('/search', async function(req, res, next) {
    try {
        const searchTerm = req.query.q || '';
        const restaurantId = req.query.restaurantId;
        
        const menuItems = await menuController.searchMenuItems(searchTerm, restaurantId);
        CreateSuccessRes(res, 200, menuItems);
    } catch (error) {
        next(error);
    }
});

// Lấy món ăn theo ID
router.get('/:id', async function(req, res, next) {
    try {
        const menuItem = await menuController.getMenuItemById(req.params.id);
        if (!menuItem) {
            return next(new Error("Món ăn không tồn tại"));
        }
        CreateSuccessRes(res, 200, menuItem);
    } catch (error) {
        next(error);
    }
});

// Lấy menu theo danh mục
router.get('/category/:categoryId', async function(req, res, next) {
    try {
        const restaurantId = req.query.restaurantId;
        
        if (!restaurantId) {
            return next(new Error("Vui lòng cung cấp ID nhà hàng"));
        }
        
        const menuItems = await menuController.filterMenuByCategory(restaurantId, req.params.categoryId);
        CreateSuccessRes(res, 200, menuItems);
    } catch (error) {
        next(error);
    }
});

// Lấy danh sách danh mục của nhà hàng
router.get('/categories/:restaurantId', async function(req, res, next) {
    try {
        const categories = await menuController.getRestaurantCategories(req.params.restaurantId);
        CreateSuccessRes(res, 200, categories);
    } catch (error) {
        next(error);
    }
});

// Tạo món ăn mới (yêu cầu đăng nhập và quyền sở hữu nhà hàng)
router.post('/', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền sở hữu nhà hàng (nên triển khai riêng)
        // ...
        
        const newMenuItem = await menuController.createMenuItem(req.body);
        CreateSuccessRes(res, 201, newMenuItem);
    } catch (error) {
        next(error);
    }
});

// Cập nhật món ăn (yêu cầu đăng nhập và quyền sở hữu)
router.put('/:id', check_authentication, checkMenuItemOwnership, async function(req, res, next) {
    try {
        const updatedMenuItem = await menuController.updateMenuItem(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedMenuItem);
    } catch (error) {
        next(error);
    }
});

// Xóa mềm món ăn (yêu cầu đăng nhập và quyền sở hữu)
router.delete('/:id', check_authentication, checkMenuItemOwnership, async function(req, res, next) {
    try {
        const deletedMenuItem = await menuController.softDeleteMenuItem(req.params.id);
        CreateSuccessRes(res, 200, { message: "Món ăn đã được xóa", menuItem: deletedMenuItem });
    } catch (error) {
        next(error);
    }
});

module.exports = router; 