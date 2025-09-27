import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = (
  configService: ConfigService
): MailerOptions => {
  const host = configService.getOrThrow<string>("MAIL_HOST");
  const login = configService.getOrThrow<string>("MAIL_LOGIN");
  const password = configService.getOrThrow<string>("MAIL_PASSWORD");

  return {
    transport: {
      logger: true,
      debug: true,
      host: configService.getOrThrow<string>("MAIL_HOST"),
      secure: false, // STARTTLS
      requireTLS: true,
      port: 2525,
      auth: {
        user: configService.getOrThrow<string>("MAIL_LOGIN"),
        pass: configService.getOrThrow<string>("MAIL_PASSWORD"),
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    },
  };
};
