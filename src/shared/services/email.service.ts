import { Inject, Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import type { EmailClient } from 'src/infra/email/emailClient';
import { InjectionTokens } from 'src/libs/common/constants';
import { handleErrorCatch } from 'src/libs/common/helpers/utils';
import { PasswordResetGenerator } from '../generator/password-reset-generator';

@Injectable()
export class EmailService {
  private readonly passwordResetGenerator = new PasswordResetGenerator();

  constructor(
    @Inject(InjectionTokens.EMAIL_CLIENT)
    private readonly emailClient: EmailClient
  ) {}

  async sendForgotPasswordEmail({
    email,
    otp,
    otpExpiresAt,
  }: {
    email: string;
    otp: string;
    otpExpiresAt: Date;
  }) {
    const expiresInMs = otpExpiresAt.getTime() - Date.now();
    const expiresInMinutes = Math.max(1, Math.round(expiresInMs / 60000));
    const expiryDisplay = otpExpiresAt.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const htmlContent = this.passwordResetGenerator.generate({
      friendlyName: email,
      otp,
      expiresInMinutes,
      expiryDisplay,
    });

    const textContent = `Password Reset Request\n\nYou requested to reset your password.\n\nYour OTP: ${otp}\nExpires in ${expiresInMinutes} minute${expiresInMinutes === 1 ? '' : 's'} (at ${expiryDisplay})\n\nSecurity:\n- Never share this code.\n- Yadsale support will never ask for it.\n\nIf you did not request this, ignore this email.\n\nReset here: ${Config.FRONTEND_URL}/forgot-password\n\nStay secure,\nThe Yadsale Team`;

    const mailOptions = {
      to: email,
      subject: 'Password Reset OTP - Yadsale',
      text: textContent,
      html: htmlContent,
    };

    try {
      await this.emailClient.send(mailOptions);
      console.log(`Password reset OTP email sent successfully to ${email}`);
    } catch (error) {
      console.error('Error sending password reset OTP email:', error);
      handleErrorCatch(error);
    }
  }
}
