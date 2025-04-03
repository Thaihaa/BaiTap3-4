const nodemailer = require("nodemailer");

// Hàm tạo tài khoản test trên Ethereal
async function createTestAccount() {
    console.log("Đang tạo tài khoản Ethereal test...");
    try {
        return await nodemailer.createTestAccount();
    } catch (error) {
        console.error("Lỗi khi tạo tài khoản test:", error);
        // Fallback khi không thể tạo tài khoản mới
        return {
            user: "test@ethereal.email",
            pass: "verysecret",
        };
    }
}

// Tạo và cấu hình transporter cho Ethereal
async function createTransporter() {
    const testAccount = await createTestAccount();
    console.log("Tài khoản test đã được tạo:", testAccount.user);
    
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
        debug: true, // In thông tin debug
    });
}

// Export module
module.exports = {
    // Email yêu cầu đặt lại mật khẩu
    sendmailFrogetPass: async function (to, URL) {
        try {
            console.log("Bắt đầu quá trình gửi email đặt lại mật khẩu...");
            const transporter = await createTransporter();
            console.log("Đang gửi email đến:", to);
            
            // Gửi email
            const info = await transporter.sendMail({
                from: `"NNPTUD System" <support@nnptud.com>`,
                to: to,
                subject: "Yêu cầu đặt lại mật khẩu",
                html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #3f51b5; font-size: 24px; margin: 0;">Đặt Lại Mật Khẩu</h1>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="margin-top: 0; color: #333;">Xin chào,</p>
                        <p style="color: #333;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${URL}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 14px;">Đặt Lại Mật Khẩu</a>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <p style="color: #555; margin: 0 0 10px 0;">Nếu nút trên không hoạt động, vui lòng sao chép và dán liên kết sau vào trình duyệt:</p>
                        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">${URL}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #777; font-size: 13px;"><strong>Lưu ý quan trọng:</strong> Liên kết này sẽ hết hạn sau 10 phút.</p>
                        <p style="color: #777; font-size: 13px;">Vui lòng không trả lời email này. Email được gửi từ hệ thống tự động.</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} NNPTUD System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
                `,
            });
            
            console.log("Email đã được gửi: %s", info.messageId);
            console.log("URL xem trước: %s", nodemailer.getTestMessageUrl(info));
            
            return {
                messageId: info.messageId,
                previewUrl: nodemailer.getTestMessageUrl(info)
            };
        } catch (error) {
            console.error("Lỗi khi gửi email:", error.message);
            console.error(error.stack);
            // Không ném lỗi, chỉ trả về thông tin lỗi
            return {
                error: true,
                message: error.message
            };
        }
    },
    
    // Email thông báo đổi mật khẩu thành công
    sendPasswordChangeConfirmation: async function (to, username) {
        try {
            console.log("Bắt đầu gửi email xác nhận đổi mật khẩu...");
            const transporter = await createTransporter();
            console.log("Đang gửi email xác nhận đến:", to);
            
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
            
            // Gửi email
            const info = await transporter.sendMail({
                from: `"NNPTUD System Security" <security@nnptud.com>`,
                to: to,
                subject: "Xác nhận: Mật khẩu của bạn đã được thay đổi",
                html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #3f51b5; font-size: 24px; margin: 0;">Thay Đổi Mật Khẩu Thành Công</h1>
                    </div>
                    
                    <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #3f51b5;">
                        <p style="margin-top: 0; color: #333;">Xin chào <strong>${username || 'Quý khách'}</strong>,</p>
                        <p style="color: #333;">Mật khẩu tài khoản của bạn đã được thay đổi thành công. Dưới đây là chi tiết thao tác:</p>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 5px; color: #555; font-weight: bold;">Hoạt động:</td>
                                <td style="padding: 8px 5px; color: #333;">Thay đổi mật khẩu</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; color: #555; font-weight: bold;">Thời gian:</td>
                                <td style="padding: 8px 5px; color: #333;">${formattedDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; color: #555; font-weight: bold;">Tài khoản:</td>
                                <td style="padding: 8px 5px; color: #333;">${to}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                        <p style="color: #333; font-size: 16px; margin-top: 0;">Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức:</p>
                        <a href="mailto:support@nnptud.com" style="background-color: #ff5722; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-top: 10px;">Báo Cáo Hoạt Động Đáng Ngờ</a>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #777; font-size: 13px;">Vui lòng không trả lời email này. Email được gửi từ hệ thống tự động.</p>
                        <p style="color: #777; font-size: 13px;">Nếu bạn có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ với bộ phận hỗ trợ khách hàng.</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} NNPTUD System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
                `,
            });
            
            console.log("Email xác nhận đã được gửi: %s", info.messageId);
            console.log("URL xem trước: %s", nodemailer.getTestMessageUrl(info));
            
            return {
                messageId: info.messageId,
                previewUrl: nodemailer.getTestMessageUrl(info)
            };
        } catch (error) {
            console.error("Lỗi khi gửi email xác nhận:", error.message);
            console.error(error.stack);
            return {
                error: true,
                message: error.message
            };
        }
    }
}