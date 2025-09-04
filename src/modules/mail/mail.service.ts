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

  private async sendMail(
    email: string,
    subject: string,
    html: string
  ): Promise<SentMessageInfo> {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
