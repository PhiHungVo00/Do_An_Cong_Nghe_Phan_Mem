const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // ví dụ: 'yourmail@gmail.com'
    pass: process.env.EMAIL_PASS, // app password hoặc mật khẩu ứng dụng
  },
});

async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Mã xác thực đăng ký tài khoản (OTP)',
    html: `<div style="font-family:sans-serif;font-size:16px;">
      <p>Xin chào,</p>
      <p>Bạn vừa đăng ký tài khoản tại SmartHome. Đây là mã xác thực (OTP) của bạn:</p>
      <h2 style="color:#1976d2;">${otp}</h2>
      <p>Mã này có hiệu lực trong 5 phút.</p>
      <p>Nếu không phải bạn thực hiện, hãy bỏ qua email này.</p>
      <br/>
      <p>Trân trọng,<br/>SmartHome Team</p>
    </div>`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail }; 