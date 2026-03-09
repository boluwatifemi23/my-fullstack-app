import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from: '"Cornerstone Catering" <no-reply@cornerstone.com>',
    to,
    subject: "Welcome to Cornerstone Catering — Your Taste of Nigeria Awaits! 🍽️",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fff8f0; padding: 20px; border-radius: 10px; color: #333;">
        
        <div style="text-align: center;">
          <h2 style="color: #d35400; font-size: 28px;">Welcome, ${name}! 🎉</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            We’re excited to have you join the <strong>Cornerstone Catering</strong> family —
            where every meal tells a story of authentic Nigerian flavor.
          </p>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #27ae60;">What’s on the Menu?</h3>
          <p style="font-size: 15px; line-height: 1.6;">
            From smoky <strong>Jollof Rice</strong> to spicy <strong>Suya</strong>, 
            to rich <strong>Egusi</strong> and fluffy <strong>Pounded Yam</strong> —
            we deliver freshly prepared Nigerian dishes right to your doorstep.
          </p>
        </div>

        <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin-top: 25px;">
          <h3 style="color: #e67e22;">Your Account Is Ready! 🚀</h3>
          <p style="font-size: 15px; line-height: 1.6;">
            You can now place orders, save your favorite meals, and enjoy exclusive member discounts.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://localhost:3000/login"
              style="background-color: #d35400; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: bold;">
              Explore Menu
            </a>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">
          <p>Follow us for daily specials:</p>
          <a href="https://instagram.com/cornerstonecatering" style="margin: 0 10px; color: #d35400;">Instagram</a> |
          <a href="https://facebook.com/cornerstonecatering" style="margin: 0 10px; color: #d35400;">Facebook</a> |
          <a href="https://twitter.com/cornerstonecaters" style="margin: 0 10px; color: #d35400;">Twitter</a>

          <p style="margin-top: 15px;">© 2025 Cornerstone Catering • Made with ❤️ in Minnesota</p>
        </div>

      </div>
    `,
  });
}


export async function sendOTPEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: '"Cornerstone Catering" <no-reply@cornerstone.com>',
    to,
    subject: "Your Cornerstone Catering Password Reset OTP 🔐",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fff8f0; padding: 20px; border-radius: 10px; color: #333;">
        
        <div style="text-align: center;">
          <h2 style="color: #d35400; font-size: 28px;">Password Reset Code</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Use the OTP below to reset your password.  
            It expires in <strong>10 minutes</strong>.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <div style="
            display: inline-block;
            padding: 15px 30px;
            background-color: #d35400;
            color: white;
            font-size: 36px;
            font-weight: bold;
            border-radius: 10px;
            letter-spacing: 8px;">
            ${otp}
          </div>
        </div>

        <p style="font-size: 15px; text-align: center; color: #555;">
          If you did not request this, simply ignore the message.
        </p>

        <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #aaa;">
          © 2025 Cornerstone Catering • Made with ❤️ in Minnesota
        </div>

      </div>
    `,
  });
}
