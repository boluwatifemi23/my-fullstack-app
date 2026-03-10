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
            We're excited to have you join the <strong>Cornerstone Catering</strong> family —
            where every meal tells a story of authentic Nigerian flavor.
          </p>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #27ae60;">What's on the Menu?</h3>
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
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login"
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
          <div style="display: inline-block; padding: 15px 30px; background-color: #d35400; color: white; font-size: 36px; font-weight: bold; border-radius: 10px; letter-spacing: 8px;">
            ${otp}
          </div>
        </div>

        <p style="font-size: 15px; text-align: center; color: #555;">
          If you did not request this, simply ignore this message.
        </p>

        <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #aaa;">
          © 2025 Cornerstone Catering • Made with ❤️ in Minnesota
        </div>
      </div>
    `,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"Cornerstone Catering" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `New Contact Message: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fff8f0; padding: 20px; border-radius: 10px; color: #333;">
        <h2 style="color: #d35400;">New Contact Form Message 📬</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name:</td>
            <td style="padding: 8px;">${data.name}</td>
          </tr>
          <tr style="background: #fff3e0;">
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Phone:</td>
            <td style="padding: 8px;">${data.phone || "Not provided"}</td>
          </tr>
          <tr style="background: #fff3e0;">
            <td style="padding: 8px; font-weight: bold;">Subject:</td>
            <td style="padding: 8px;">${data.subject}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #fff; border-left: 4px solid #d35400; border-radius: 4px;">
          <strong>Message:</strong>
          <p style="margin-top: 8px; line-height: 1.6;">${data.message}</p>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 13px; color: #aaa;">
          © 2025 Cornerstone Catering • Made with ❤️ in Minnesota
        </div>
      </div>
    `,
  });
}

export async function sendOrderConfirmedEmail(
  to: string,
  name: string,
  orderId: string,
  items: { name: string; quantity: number; price: number }[],
  total: number,
  deliveryDate: string,
  deliveryTime: string,
) {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #f0e0d0;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0e0d0; text-align:center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0e0d0; text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  await transporter.sendMail({
    from: '"Cornerstone Catering" <cateringcornerstone2@gmail.com>',
    to,
    subject: `Order Confirmed! 🎉 Your order ${orderId} is being prepared`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #fff8f0; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <div style="text-align:center; margin-bottom: 24px;">
          <h1 style="color: #f54a00; margin: 0;">Cornerstone Catering</h1>
          <p style="color: #888; margin: 4px 0;">Authentic Nigerian Meals</p>
        </div>

        <div style="background: #f54a00; color: white; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <h2 style="margin: 0 0 8px;">Order Confirmed! 🎉</h2>
          <p style="margin: 0; font-size: 14px;">Thank you ${name}, your order is being prepared with love!</p>
          <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 10px; margin-top: 12px;">
            <p style="margin: 0; font-size: 13px;">Order ID</p>
            <p style="margin: 4px 0 0; font-size: 22px; font-weight: bold; letter-spacing: 2px;">${orderId}</p>
          </div>
        </div>

        <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 16px;">
          <h3 style="color: #333; margin: 0 0 12px;">Your Order</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #fff3e0;">
                <th style="padding: 8px; text-align:left;">Item</th>
                <th style="padding: 8px; text-align:center;">Qty</th>
                <th style="padding: 8px; text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="text-align: right; margin-top: 12px; font-size: 18px; font-weight: bold; color: #f54a00;">
            Total: $${total.toFixed(2)}
          </div>
        </div>

        <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 16px;">
          <h3 style="color: #333; margin: 0 0 12px;">Delivery Details</h3>
          <p style="margin: 4px 0; color: #555;">📅 <strong>Date:</strong> ${deliveryDate}</p>
          <p style="margin: 4px 0; color: #555;">🕐 <strong>Time:</strong> ${deliveryTime}</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-order/${orderId}"
            style="background: #f54a00; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Track Your Order
          </a>
        </div>

        <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} Cornerstone Catering Services. Made with ❤️
        </p>
      </div>
    `,
  });
}

export async function sendOutForDeliveryEmail(to: string, name: string, orderId: string) {
  await transporter.sendMail({
    from: '"Cornerstone Catering" <cateringcornerstone2@gmail.com>',
    to,
    subject: `Your order ${orderId} is on its way! 🚗`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #fff8f0; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <div style="text-align:center; margin-bottom: 24px;">
          <h1 style="color: #f54a00; margin: 0;">Cornerstone Catering</h1>
        </div>

        <div style="background: #27ae60; color: white; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 48px; margin-bottom: 8px;">🚗</div>
          <h2 style="margin: 0 0 8px;">Your Order Is On Its Way!</h2>
          <p style="margin: 0;">Hey ${name}, your delicious meal is heading to your doorstep right now!</p>
          <p style="margin: 12px 0 0; font-weight: bold; letter-spacing: 2px;">${orderId}</p>
        </div>

        <div style="background: white; border-radius: 10px; padding: 20px; text-align: center;">
          <p style="color: #555; margin: 0 0 16px;">Track your order status in real time</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-order/${orderId}"
            style="background: #f54a00; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Track Order
          </a>
        </div>

        <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} Cornerstone Catering Services. Made with ❤️
        </p>
      </div>
    `,
  });
}

export async function sendDeliveredEmail(to: string, name: string, orderId: string) {
  await transporter.sendMail({
    from: '"Cornerstone Catering" <cateringcornerstone2@gmail.com>',
    to,
    subject: `Your order ${orderId} has been delivered! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #fff8f0; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <div style="text-align:center; margin-bottom: 24px;">
          <h1 style="color: #f54a00; margin: 0;">Cornerstone Catering</h1>
        </div>

        <div style="background: #f54a00; color: white; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
          <h2 style="margin: 0 0 8px;">Delivered!</h2>
          <p style="margin: 0;">Hey ${name}, your order has been delivered. Enjoy your authentic Nigerian meal!</p>
          <p style="margin: 12px 0 0; font-weight: bold; letter-spacing: 2px;">${orderId}</p>
        </div>

        <div style="background: white; border-radius: 10px; padding: 20px; text-align: center;">
          <p style="color: #555; font-size: 16px;">We hope you enjoyed every bite! 😋</p>
          <p style="color: #888; font-size: 14px;">Thank you for choosing Cornerstone Catering.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/menu"
            style="background: #f54a00; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 12px;">
            Order Again
          </a>
        </div>

        <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} Cornerstone Catering Services. Made with ❤️
        </p>
      </div>
    `,
  });
}