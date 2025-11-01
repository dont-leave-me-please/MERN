import nodemailer from "nodemailer";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

// Create transporter for Mailtrap
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1064dbb887a731", // replace with your Mailtrap credentials
    pass: "ddf7ba6272d319",
  },
});

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{{resetLink}}",
      resetURL
    );

    const mailOptions = {
      from: '"Your App" <no-reply@yourapp.com>',
      to: email,
      subject: "Reset Your Password",
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
  }
};
