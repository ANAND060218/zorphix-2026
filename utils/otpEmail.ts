export const getOtpEmailTemplate = (name: string, otp: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP - Zorphix</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; background: linear-gradient(135deg, #243763 0%, #1a1a2e 100%); text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">ZORPHIX</h1>
        <p style="color: #9d4edd; margin: 10px 0 0; font-size: 14px;">Password Reset Request</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">Hello ${name || 'User'},</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          We received a request to reset your password for your Zorphix account. Use the OTP below to complete the password reset process:
        </p>
        <div style="background: linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
          <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 2px;">Your OTP Code</p>
          <p style="color: #ffffff; font-size: 36px; font-weight: 700; margin: 0; letter-spacing: 8px;">${otp}</p>
        </div>
        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px;">
          <strong>⏱️ This code will expire in 10 minutes.</strong>
        </p>
        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
          If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #1a1a2e; text-align: center;">
        <p style="color: #888888; font-size: 12px; margin: 0;">
          © 2024 Zorphix. All rights reserved.
        </p>
        <p style="color: #666666; font-size: 11px; margin: 10px 0 0;">
          This is an automated message. Please do not reply to this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
