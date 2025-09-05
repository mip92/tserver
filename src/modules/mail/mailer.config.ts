import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = (
  configService: ConfigService
): MailerOptions => {
  const port = configService.getOrThrow<number>("MAIL_PORT");
  const isSecure = String(port) === "465";
  const isPort2525 = String(port) === "2525";

  return {
    transport: {
      host: configService.getOrThrow<string>("MAIL_HOST"),
      port,
      secure: isSecure,
      auth: {
        user: configService.getOrThrow<string>("MAIL_LOGIN"),
        pass: configService.getOrThrow<string>("MAIL_PASSWORD"),
      },
      tls: isPort2525 ? { rejectUnauthorized: false } : undefined,
    },
    defaults: {
      from: configService.getOrThrow<string>("MAIL_LOGIN"),
    },
  };
};
