import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BrevoApiService {
  private readonly apiKey: string;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>("BREVO_API_KEY");
    this.fromEmail = this.configService.getOrThrow<string>("BREVO_FROM_EMAIL");
  }

  async sendEmail(to: string, subject: string, html: string): Promise<any> {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify({
          sender: {
            email: this.fromEmail,
            name: "Tattoo Server",
          },
          to: [
            {
              email: to,
            },
          ],
          subject: subject,
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const result = await response.json();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
