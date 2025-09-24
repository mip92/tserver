import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = (
  configService: ConfigService
): MailerOptions => {
  const port = configService.getOrThrow<number>("MAIL_PORT");
  const isSecure = String(port) === "465";
  const isPort2525 = String(port) === "2525";

  // Log configuration for debugging
  console.log("📧 [MAIL CONFIG] SMTP Configuration:");
  console.log(
    `📧 [MAIL CONFIG] Host: ${configService.getOrThrow<string>("MAIL_HOST")}`
  );
  console.log(`📧 [MAIL CONFIG] Port: ${port}`);
  console.log(`📧 [MAIL CONFIG] Secure: ${isSecure}`);
  console.log(`📧 [MAIL CONFIG] TLS: ${isPort2525 ? "enabled" : "disabled"}`);
  console.log(
    `📧 [MAIL CONFIG] Login: ${configService.getOrThrow<string>("MAIL_LOGIN")}`
  );
  console.log(
    `📧 [MAIL CONFIG] Password: ${
      configService.getOrThrow<string>("MAIL_PASSWORD")
        ? "***SET***"
        : "NOT SET"
    }`
  );

  return {
    transport: {
      host: configService.getOrThrow<string>("MAIL_HOST"),
      port,
      secure: isSecure,
      auth: {
        user: configService.getOrThrow<string>("MAIL_LOGIN"),
        pass: configService.getOrThrow<string>("MAIL_PASSWORD"),
      },
      tls: isPort2525
        ? {
            rejectUnauthorized: false,
            ciphers: "SSLv3",
          }
        : undefined,
    },
    defaults: {
      from: configService.getOrThrow<string>("MAIL_LOGIN"),
    },
  };
};
