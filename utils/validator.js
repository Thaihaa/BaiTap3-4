let { body, validationResult } = require('express-validator');
const { ERROR_USERNAME, ERROR_EMAIL, ERROR_PASSWORD } = require('./constants');
let util = require('util')
let {CreateSuccessRes} = require('./ResHandler');

let constants = require('./constants')
let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }
}
module.exports = {
    validate: function (req, res, next) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            CreateSuccessRes(res, 404, errors.array());
        } else {
            next()
        }
    },
    validationSiginUp: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").isStrongPassword(options.password).withMessage(util.format(ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        )),
        body("email").isEmail().withMessage(constants.ERROR_EMAIL)
    ],
    validationCreateUser: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").isStrongPassword(options.password).withMessage(ERROR_PASSWORD),
        body("email").isEmail().withMessage(util.format(ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        )),
        body('role').isIn(['user', 'admin', 'mod']).withMessage("role khong hop le")
    ],
    validationLogin: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").notEmpty().withMessage("Mật khẩu không được để trống")
    ],
    validationChangePassword: [
        body("oldpassword").notEmpty().withMessage("Mật khẩu cũ không được để trống"),
        body("newpassword").isStrongPassword(options.password).withMessage(util.format(ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        ))
    ],
    validationForgotPassword: [
        body("email").isEmail().withMessage(constants.ERROR_EMAIL)
    ],
    validationResetPassword: [
        body("password").isStrongPassword(options.password).withMessage(util.format(ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        ))
    ],
    // Validator cho nhà hàng
    restaurantValidation: [
        body("name").notEmpty().withMessage("Tên nhà hàng không được để trống"),
        body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
        body("phone").notEmpty().matches(/^[0-9]{10,11}$/).withMessage("Số điện thoại không hợp lệ"),
        body("email").isEmail().withMessage("Email không hợp lệ"),
        body("cuisineType").optional(),
        body("priceRange").optional().isIn(['$', '$$', '$$$', '$$$$']).withMessage("Khoảng giá không hợp lệ"),
        body("openingHours").optional(),
        body("description").optional(),
        body("imageUrl").optional().isURL().withMessage("URL hình ảnh không hợp lệ")
    ],
    // Validator cho menu item
    menuItemValidation: [
        body("name").notEmpty().withMessage("Tên món ăn không được để trống"),
        body("price").isNumeric().withMessage("Giá phải là số").custom(value => {
            if (value <= 0) throw new Error("Giá phải lớn hơn 0");
            return true;
        }),
        body("category").notEmpty().withMessage("Danh mục không được để trống"),
        body("description").optional(),
        body("imageUrl").optional().isURL().withMessage("URL hình ảnh không hợp lệ"),
        body("isAvailable").optional().isBoolean().withMessage("Trạng thái sẵn có phải là boolean"),
        body("isSpecial").optional().isBoolean().withMessage("Trạng thái đặc biệt phải là boolean"),
        body("discountPercent").optional().isInt({ min: 0, max: 100 }).withMessage("Phần trăm giảm giá phải từ 0-100"),
        body("preparationTime").optional().isInt({ min: 1 }).withMessage("Thời gian chuẩn bị phải lớn hơn 0")
    ],
    // Validator cho order
    orderValidation: [
        body("items").isArray({ min: 1 }).withMessage("Đơn hàng phải có ít nhất một món"),
        body("items.*.menuItem").notEmpty().withMessage("ID món ăn không được để trống"),
        body("items.*.quantity").isInt({ min: 1 }).withMessage("Số lượng phải lớn hơn 0"),
        body("restaurant").notEmpty().withMessage("ID nhà hàng không được để trống"),
        body("deliveryMethod").isIn(['pickup', 'delivery']).withMessage("Phương thức giao hàng không hợp lệ"),
        body("deliveryAddress").custom((value, { req }) => {
            if (req.body.deliveryMethod === 'delivery' && !value) {
                throw new Error("Địa chỉ giao hàng không được để trống với phương thức giao hàng");
            }
            return true;
        }),
        body("paymentMethod").isIn(['cash', 'credit_card', 'momo', 'zalopay', 'banking']).withMessage("Phương thức thanh toán không hợp lệ"),
        body("specialRequests").optional()
    ],
    // Validator cho reservation
    reservationValidation: [
        body("date").isDate().withMessage("Ngày đặt bàn không hợp lệ"),
        body("time").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Thời gian không hợp lệ (HH:MM)"),
        body("partySize").isInt({ min: 1 }).withMessage("Số người phải lớn hơn 0"),
        body("restaurant").notEmpty().withMessage("ID nhà hàng không được để trống"),
        body("specialRequests").optional()
    ],
    // Validator cho review
    reviewValidation: [
        body("rating").isInt({ min: 1, max: 5 }).withMessage("Đánh giá phải từ 1-5 sao"),
        body("restaurant").notEmpty().withMessage("ID nhà hàng không được để trống"),
        body("comment").optional(),
        body("foodRating").optional().isInt({ min: 1, max: 5 }).withMessage("Đánh giá món ăn phải từ 1-5 sao"),
        body("serviceRating").optional().isInt({ min: 1, max: 5 }).withMessage("Đánh giá dịch vụ phải từ 1-5 sao"),
        body("ambienceRating").optional().isInt({ min: 1, max: 5 }).withMessage("Đánh giá không gian phải từ 1-5 sao"),
        body("valueRating").optional().isInt({ min: 1, max: 5 }).withMessage("Đánh giá giá trị phải từ 1-5 sao"),
        body("photos").optional().isArray().withMessage("Danh sách ảnh phải là mảng")
    ]
}