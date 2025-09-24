import { SentMessageInfo } from "nodemailer";

import { VerificationTemplate } from "./templates/verification.template";
import { PasswordRecoveryTemplate } from "./templates/password-recovery.template";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/render";

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  public async sendVerificationToken(
    email: string,
    token: string
  ): Promise<SentMessageInfo> {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGINS");
    const html = await render(VerificationTemplate({ domain, token }));

    const sentMessageInfo: SentMessageInfo = await this.sendMail(
      email,
      "Account Verification",
      html
    );

    return sentMessageInfo;
  }

  public async sendPasswordRecoveryToken(
    email: string,
    token: string
  ): Promise<SentMessageInfo> {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGINS");
    const html = await render(PasswordRecoveryTemplate({ domain, token }));

    const sentMessageInfo: SentMessageInfo = await this.sendMail(
      email,
      "Reset password",
      html
    );

    return sentMessageInfo;
  }

  public async sendVerificationCode(
    email: string,
    code: string
  ): Promise<SentMessageInfo> {
    console.log(`📧 [MAIL] Sending verification code to: ${email}`);
    console.log(`📧 [MAIL] Code: ${code}`);

    // Use simple HTML without React rendering to save memory
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verification Code</h2>
            <p style="color: #666; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background: #e9ecef; padding: 20px; border-radius: 6px; display: inline-block; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #18B9AE; letter-spacing: 4px;">${code}</span>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">This code will expire in 20 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    try {
      console.log(`📧 [MAIL] Sending email to: ${email}`);

      const sentMessageInfo: SentMessageInfo = await this.sendMail(
        email,
        "Verification Code",
        html
      );

      console.log(`✅ [MAIL] Verification code sent successfully to: ${email}`);
      console.log(`📧 [MAIL] Message ID: ${sentMessageInfo?.messageId}`);

      return sentMessageInfo;
    } catch (error) {
      console.error(`❌ [MAIL] Failed to send verification code to: ${email}`);
      console.error(`❌ [MAIL] Error:`, error);
      throw error;
    }
  }

  private async sendMail(
    email: string,
    subject: string,
    html: string
  ): Promise<SentMessageInfo> {
    console.log(`📧 [MAIL] Attempting to send email to: ${email}`);
    console.log(`📧 [MAIL] Subject: ${subject}`);

    try {
      const result = await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });

      console.log(`✅ [MAIL] Email sent successfully to: ${email}`);
      return result;
    } catch (error) {
      console.error(`❌ [MAIL] Failed to send email to: ${email}`);
      console.error(`❌ [MAIL] Subject: ${subject}`);
      console.error(`❌ [MAIL] Error details:`, error);
      throw error;
    }
  }
}
