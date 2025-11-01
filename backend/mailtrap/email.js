import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

const html = VERIFICATION_EMAIL_TEMPLATE.replace(
  "{{verificationLink}}",
  verificationUrl
);

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
};
