export const VERIFICATION_EMAIL_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Verify Your Email Address</h2>
    <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
    <a href="{{verificationLink}}" 
       style="display: inline-block; padding: 10px 20px; color: white; background-color: #4CAF50; 
              text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>
    <p>If you didn’t create this account, you can safely ignore this email.</p>
    <br />
    <p>Best regards,<br />The Team</p>
  </div>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. You can reset it by clicking the button below:</p>
    <a href="{{resetLink}}" 
       style="display: inline-block; padding: 10px 20px; color: white; background-color: #2196F3; 
              text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>If you didn’t request this, please ignore this email.</p>
    <br />
    <p>Best regards,<br />The Team</p>
  </div>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Password Reset Successful</h2>
    <p>Your password has been successfully reset.</p>
    <p>If you didn’t perform this action, please contact our support immediately.</p>
    <br />
    <p>Best regards,<br />The Team</p>
  </div>
`;
