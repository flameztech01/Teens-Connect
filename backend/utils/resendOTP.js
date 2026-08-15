import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random()  * 900000).toString();
};

// Send OTP via email
export const sendOTPEmail = async (email, otp, name = 'User') => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'teensconnect@flameztech.online',
      to: email,
      subject: 'Verify Your Email - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f6f9fc;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
              }
              .header h1 {
                color: #1a1a2e;
                font-size: 24px;
                margin: 0;
              }
              .content {
                padding: 30px 0;
                text-align: center;
              }
              .content p {
                color: #4a4a4a;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .otp-code {
                font-size: 48px;
                font-weight: bold;
                color: #4f46e5;
                background-color: #f0f4ff;
                padding: 20px 40px;
                border-radius: 12px;
                display: inline-block;
                letter-spacing: 8px;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
              }
              .otp-expiry {
                color: #888;
                font-size: 14px;
                margin-top: 10px;
              }
              .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
                color: #888;
                font-size: 14px;
              }
              .footer a {
                color: #4f46e5;
                text-decoration: none;
              }
              .button {
                display: inline-block;
                background-color: #4f46e5;
                color: #ffffff;
                padding: 12px 30px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Email Verification</h1>
              </div>
              <div class="content">
                <p>Hello <strong>${name}</strong>,</p>
                <p>Thank you for signing up! Please use the verification code below to complete your registration.</p>
                <div class="otp-code">${otp}</div>
                <p class="otp-expiry">This code will expire in <strong>10 minutes</strong></p>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  If you didn't request this, please ignore this email.
                </p>
              </div>
              <div class="footer">
                <p>&copy; 2026 Your Company. All rights reserved.</p>
                <p>
                  <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}">Visit our website</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error('Failed to send OTP email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send OTP via SMS (using Resend or another SMS provider)
export const sendOTPSMS = async (phone, otp) => {
  try {
    // Resend currently doesn't support SMS directly
    // You can integrate with Twilio, Vonage, or other SMS providers here
    
    // Example using Twilio (you'd need to install twilio package)
    // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilioClient.messages.create({
    //   body: `Your verification code is: ${otp}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // });

    console.log(`📱 SMS OTP sent to ${phone}: ${otp}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
};

// Send both email and SMS OTP
export const sendOTP = async (email, phone, otp, name = 'User') => {
  try {
    const emailResult = await sendOTPEmail(email, otp, name);
    // SMS is optional - comment out if not needed
    // const smsResult = await sendOTPSMS(phone, otp);
    
    return {
      success: true,
      email: emailResult.data,
      // sms: smsResult,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

// Generate and send OTP in one function
export const generateAndSendOTP = async (user) => {
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Update user with OTP
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send OTP via email (and optionally SMS)
  await sendOTP(user.email, user.phone, otp, user.name);

  return { otp, otpExpires };
};

export default {
  generateOTP,
  sendOTPEmail,
  sendOTPSMS,
  sendOTP,
  generateAndSendOTP,
};