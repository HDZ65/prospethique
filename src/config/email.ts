export const emailConfig = {
  host: process.env.EMAIL_HOST || 'pro3.mail.ovh.net',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
};