import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/render";
import { VerificationTemplate } from "./templates/verification.template";
import { PasswordRecoveryTemplate } from "./templates/password-recovery.template";
import { VerificationCodeTemplate } from "./templates/verification-code.template";
import { BrevoApiService } from "./brevo-api.service";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly brevoApiService: BrevoApiService,
    private readonly configService: ConfigService
  ) {}

  public async sendVerificationToken(
    email: string,
    token: string
  ): Promise<any> {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGINS");
    const html = await render(VerificationTemplate({ domain, token }));

    const result = await this.sendMail(email, "Account Verification", html);

    return result;
  }

  public async sendPasswordRecoveryToken(
    email: string,
    token: string
  ): Promise<any> {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGINS");
    const html = await render(PasswordRecoveryTemplate({ domain, token }));

    const result = await this.sendMail(email, "Reset password", html);

    return result;
  }

  public async sendVerificationCode(email: string, code: string): Promise<any> {
    console.log(`📧 [MAIL] Sending verification code to: ${email}`);
    console.log(`📧 [MAIL] Code: ${code}`);

    const html = await render(VerificationCodeTemplate({ code }));

    try {
      console.log(`📧 [MAIL] Sending email to: ${email}`);

      const result = await this.sendMail(email, "Verification Code", html);

      console.log(`✅ [MAIL] Verification code sent successfully to: ${email}`);
      console.log(`📧 [MAIL] Message ID: ${result?.id}`);

      return result;
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
  ): Promise<any> {
    console.log(`📧 [MAIL] ===== SENDING EMAIL =====`);
    console.log(`📧 [MAIL] To: ${email}`);
    console.log(`📧 [MAIL] Subject: ${subject}`);
    console.log(`📧 [MAIL] HTML length: ${html.length} characters`);
    console.log(`📧 [MAIL] Timestamp: ${new Date().toISOString()}`);

    try {
      console.log(`📧 [MAIL] Using Brevo API...`);
      const result = await this.brevoApiService.sendEmail(email, subject, html);

      console.log(`✅ [MAIL] Email sent successfully!`);
      console.log(`📧 [MAIL] Message ID: ${result.messageId}`);
      console.log(`📧 [MAIL] =========================`);
      return result;
    } catch (error) {
      console.error(`❌ [MAIL] ===== EMAIL FAILED =====`);
      console.error(`❌ [MAIL] To: ${email}`);
      console.error(`❌ [MAIL] Subject: ${subject}`);
      console.error(`❌ [MAIL] Error type: ${error.constructor.name}`);
      console.error(`❌ [MAIL] Error message: ${error.message}`);
      console.error(`❌ [MAIL] Full error:`, error);
      console.error(`❌ [MAIL] ========================`);
      throw error;
    }
  }
}
