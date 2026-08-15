import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email – Professional Minimalist Design
export const sendOTPEmail = async (email, otp, name = 'User') => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'teensconnect@flameztech.online',
      to: email,
      subject: 'Your OTP – Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
              /* Reset & base */
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #1a1a2e;
              }
              .container {
                max-width: 520px;
                margin: 0 auto;
                padding: 40px 20px;
                background-color: #f8f9fa;
              }
              .card {
                background-color: #ffffff;
                border-radius: 16px;
                padding: 40px 32px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                border: 1px solid #eaeef0;
              }
              .brand {
                text-align: center;
                margin-bottom: 32px;
              }
              .brand h2 {
                font-size: 22px;
                font-weight: 600;
                margin: 0;
                color: #1a1a2e;
                letter-spacing: -0.3px;
              }
              .brand h2 span {
                color: #f4a825;
              }
              .brand p {
                font-size: 13px;
                color: #8b8b8b;
                margin: 4px 0 0;
              }
              .divider {
                height: 1px;
                background: #eaeef0;
                margin: 24px 0;
              }
              .greeting {
                font-size: 15px;
                color: #1a1a2e;
                margin: 0 0 8px;
                font-weight: 500;
              }
              .message {
                font-size: 14px;
                color: #4a4a4a;
                margin: 0 0 24px;
              }
              .otp-box {
                background: #f8faff;
                border-radius: 12px;
                padding: 20px 24px;
                text-align: center;
                border: 1px solid #eaeef0;
                margin: 16px 0 24px;
              }
              .otp-code {
                font-size: 40px;
                font-weight: 700;
                letter-spacing: 12px;
                color: #1a1a2e;
                font-family: 'Courier New', monospace;
                display: inline-block;
                padding: 4px 0;
              }
              .otp-label {
                display: block;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8b8b8b;
                margin-bottom: 8px;
              }
              .expiry {
                font-size: 13px;
                color: #8b8b8b;
                text-align: center;
                margin: 0 0 24px;
              }
              .expiry strong {
                color: #1a1a2e;
                font-weight: 500;
              }
              .note {
                font-size: 13px;
                color: #8b8b8b;
                text-align: center;
                margin: 16px 0 0;
              }
              .footer {
                text-align: center;
                margin-top: 24px;
                font-size: 12px;
                color: #b0b0b0;
              }
              .footer a {
                color: #f4a825;
                text-decoration: none;
                font-weight: 500;
              }
              @media (max-width: 480px) {
                .card {
                  padding: 28px 20px;
                }
                .otp-code {
                  font-size: 32px;
                  letter-spacing: 8px;
                }
                .brand h2 {
                  font-size: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="brand">
                  <h2>Teens<span>Connect</span></h2>
                  <p>Verification</p>
                </div>

                <p class="greeting">Hello${name ? ` ${name}` : ''},</p>
                <p class="message">
                  Use the code below to verify your email address and complete your registration.
                </p>

                <div class="otp-box">
                  <span class="otp-label">One‑Time Password</span>
                  <span class="otp-code">${otp}</span>
                </div>

                <p class="expiry">This code expires in <strong>10 minutes</strong>.</p>
                <p class="note">If you didn't request this, you can safely ignore this email.</p>

                <div class="divider"></div>

                <div class="footer">
                  &copy; ${new Date().getFullYear()} TeensConnect &bull;
                  <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}">Visit website</a>
                </div>
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
    // SMS is optional – comment out if not needed
    // const smsResult = await sendOTPSMS(phone, otp);
    return {
      success: true,
      email: emailResult.data,
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

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

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