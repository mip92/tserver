import { MailService } from "./mail.service";
import { BrevoApiService } from "./brevo-api.service";
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MailService, BrevoApiService],
  exports: [MailService],
})
export class MailModule {}
