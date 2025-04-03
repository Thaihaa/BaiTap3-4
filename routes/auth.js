var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let { check_authentication } = require('../utils/check_auth')
let bcrypt = require('bcrypt')
let { validate, validationSiginUp, validationLogin, validationChangePassword, validationForgotPassword, validationResetPassword } = require('../utils/validator')
let crypto = require('crypto')
let mailer = require('../utils/mailer')

/* GET users listing. */
router.post('/login', validationLogin, validate, async function (req, res, next) {
    try {
        let body = req.body;
        let username = body.username;
        let password = body.password
        let result = await userController.Login(username, password);
        let token = jwt.sign({
            id: result._id,
            expire: new Date(Date.now() + 24 * 3600 * 1000)
        }, constants.SECRET_KEY)
        CreateSuccessRes(res, 200, token);
    } catch (error) {
        next(error)
    }
});
router.post('/signup', validationSiginUp, validate, async function (req, res, next) {
    try {
        let body = req.body;
        let username = body.username;
        let password = body.password;
        let email = body.email
        let result = await userController.CreateAnUser(
            username, password, email, 'user');
        let token = jwt.sign({
            id: result._id,
            expire: new Date(Date.now() + 24 * 3600 * 1000)
        }, constants.SECRET_KEY)
        CreateSuccessRes(res, 200, token);
    } catch (error) {
        next(error)
    }
});
router.get("/me", check_authentication, async function (req, res, next) {
    CreateSuccessRes(res, 200, req.user);
})
router.post('/changepassword', check_authentication, validationChangePassword, validate, async function (req, res, next) {
    try {
        let body = req.body;
        let oldpassword = body.oldpassword;
        let newpassword = body.newpassword;
        let user = req.user;
        
        // Kiểm tra mật khẩu cũ
        if (bcrypt.compareSync(oldpassword, user.password)) {
            // Đặt mật khẩu mới
            user.password = newpassword;
            await user.save();
            
            // Gửi email xác nhận thay đổi mật khẩu
            try {
                const emailResult = await mailer.sendPasswordChangeConfirmation(user.email, user.username);
                console.log("Đã gửi email xác nhận thay đổi mật khẩu:", emailResult);
            } catch (emailError) {
                console.error("Không thể gửi email xác nhận:", emailError);
                // Vẫn tiếp tục xử lý dù có lỗi gửi mail
            }
            
            // Trả về thành công
            CreateSuccessRes(res, 200, { 
                message: "Thay đổi mật khẩu thành công",
                email: user.email 
            });
        } else {
            next(new Error("Mật khẩu cũ không đúng"))
        }
    } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error);
        next(error);
    }
})
router.post('/forgotpassword', validationForgotPassword, validate, async function (req, res, next) {
    try {
        let email = req.body.email;
        console.log("Đã nhận yêu cầu đặt lại mật khẩu cho email:", email);
        
        let user = await userController.GetUserByEmail(email);
        if (user) {
            // Tạo token ngẫu nhiên
            let token = crypto.randomBytes(24).toString('hex');
            console.log("Token đã tạo:", token);
            
            // Cập nhật token vào user object
            user.tokenResetPassword = token;
            user.tokenResetPasswordExp = (new Date(Date.now() + 10 * 60 * 1000)).getTime();
            
            // Lưu user với token mới
            await user.save();
            
            // Kiểm tra lại xem token đã được lưu đúng chưa
            let updatedUser = await userController.GetUserById(user._id);
            console.log("Token đã lưu vào database:", updatedUser.tokenResetPassword);
            
            // Tạo URL reset password
            let URLReset = `http://localhost:3000/auth/resetpassword/${token}`
            
            // Gửi email
            try {
                const emailResult = await mailer.sendmailFrogetPass(user.email, URLReset);
                console.log("Kết quả gửi email:", emailResult);
                
                // Thêm thông tin từ Ethereal nếu có
                let responseData = {
                    message: "Đã tạo token reset password thành công",
                    url: URLReset,
                    tokenExpiresAt: new Date(user.tokenResetPasswordExp).toLocaleString(),
                    email: user.email
                };
                
                // Thêm URL xem trước email nếu dùng Ethereal
                if (emailResult && emailResult.previewUrl) {
                    responseData.emailPreviewUrl = emailResult.previewUrl;
                }
                
                CreateSuccessRes(res, 200, responseData);
            } catch (error) {
                console.error("Lỗi gửi email:", error);
                // Vẫn trả về token dù có lỗi gửi mail
                CreateSuccessRes(res, 200, {
                    message: "Đã tạo token reset password thành công (nhưng không gửi được email)",
                    url: URLReset,
                    tokenExpiresAt: new Date(user.tokenResetPasswordExp).toLocaleString(),
                    email: user.email,
                    emailError: error.message || "Không thể gửi email"
                });
            }
        } else {
            throw new Error("email khong ton tai")
        }
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý forgotpassword:", error);
        next(error)
    }
})


router.post('/resetpassword/:token', validationResetPassword, validate, async function (req, res, next) {
    try {
        let token = req.params.token;
        console.log("Đang kiểm tra token:", token);
        
        // Tìm user với token
        let user = await userController.GetUserByToken(token);
        if (user) {
            console.log("Tìm thấy user với token, thời gian hết hạn:", new Date(user.tokenResetPasswordExp).toLocaleString());
            
            if (user.tokenResetPasswordExp > Date.now()) {
                let password = req.body.password;
                user.password = password;
                
                // Xóa token sau khi sử dụng
                user.tokenResetPassword = null;
                user.tokenResetPasswordExp = null;
                
                // Lưu thay đổi
                await user.save();
                
                // Gửi email xác nhận thay đổi mật khẩu
                try {
                    const emailResult = await mailer.sendPasswordChangeConfirmation(user.email, user.username);
                    console.log("Đã gửi email xác nhận thay đổi mật khẩu:", emailResult);
                } catch (emailError) {
                    console.error("Không thể gửi email xác nhận:", emailError);
                    // Vẫn tiếp tục xử lý dù có lỗi gửi mail
                }
                
                // Trả về thành công
                CreateSuccessRes(res, 200, { 
                    message: "Đặt lại mật khẩu thành công",
                    email: user.email,
                    redirectTo: "/auth/login" // Thêm đường dẫn chuyển hướng đến trang đăng nhập
                });
            } else {
                throw new Error("Token đã hết hạn, vui lòng yêu cầu token mới")
            }
        } else {
            throw new Error("Token không hợp lệ hoặc không tồn tại")
        }
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý resetpassword:", error);
        next(error)
    }
})


module.exports = router;
