import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosResponse } from "axios";
import {
  SmsSendResult,
  SmsBalanceResult,
} from "./interfaces/sms-provider.interface";

interface KyivstarTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly apiUrl: string;
  private readonly sender: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>("sms.clientId") || "";
    this.clientSecret =
      this.configService.get<string>("sms.clientSecret") || "";
    this.apiUrl =
      this.configService.get<string>("sms.apiUrl") ||
      "https://api-gateway.kyivstar.ua";
    this.sender = "messagedesk"; // this.configService.get<string>("sms.sender") || "messagedesk";

    if (!this.clientId || !this.clientSecret) {
      this.logger.warn("Kyivstar SMS credentials are not configured");
    }
  }

  async sendSms(
    phoneNumber: string,
    message: string,
    sender?: string
  ): Promise<SmsSendResult> {
    if (!this.clientId || !this.clientSecret) {
      throw new BadRequestException("Kyivstar SMS service is not configured");
    }

    try {
      // Получаем токен доступа
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error("Failed to get access token");
      }

      console.log(token);

      // Форматируем номер телефона
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Отправляем SMS через Киевстар API
      const response = await axios.post(
        `${this.apiUrl}/sandbox/rest/v1beta/sms`,
        {
          from: sender || this.sender,
          to: formattedPhone.replace("+", ""), // Убираем + из номера
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      this.logger.log(
        `SMS sent successfully to ${formattedPhone} via Kyivstar`
      );

      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${phoneNumber} via Kyivstar:`,
        error.response?.data || error.message
      );

      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to send SMS via Kyivstar",
      };
    }
  }

  async sendVerificationCode(
    phoneNumber: string,
    code: string
  ): Promise<SmsSendResult> {
    const message = `Ваш код подтверждения: ${code}. Не сообщайте его никому.`;

    return this.sendSms(phoneNumber, message);
  }

  async sendPasswordResetCode(
    phoneNumber: string,
    code: string
  ): Promise<SmsSendResult> {
    const message = `Код для восстановления пароля: ${code}. Если вы не запрашивали восстановление, проигнорируйте это сообщение.`;
    return this.sendSms(phoneNumber, message);
  }

  async getBalance(): Promise<SmsBalanceResult> {
    if (!this.clientId || !this.clientSecret) {
      throw new BadRequestException("Kyivstar SMS service is not configured");
    }

    try {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error("Failed to get access token");
      }

      const response = await axios.get(`${this.apiUrl}/sms/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        success: true,
        balance: response.data.balance,
      };
    } catch (error) {
      this.logger.error(
        "Failed to get SMS balance from Kyivstar:",
        error.response?.data || error.message
      );

      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Failed to get balance from Kyivstar",
      };
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, "");

    // If starts with 380, keep as is
    if (cleaned.startsWith("380")) {
      return `+${cleaned}`;
    }

    // If starts with 0, replace with 380
    if (cleaned.startsWith("0")) {
      return `+380${cleaned.substring(1)}`;
    }

    // If starts with 80, replace with 380
    if (cleaned.startsWith("80")) {
      return `+3${cleaned}`;
    }

    // If starts with 3, add +
    if (cleaned.startsWith("3")) {
      return `+${cleaned}`;
    }

    // Default: assume it's a local number starting with 0
    return `+380${cleaned}`;
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Ukrainian phone number should be +380XXXXXXXXX (13 characters total)
    return /^\+380\d{9}$/.test(formatted);
  }

  private async getAccessToken(): Promise<string | null> {
    console.log(this.accessToken, this.tokenExpiresAt);
    if (
      this.accessToken &&
      this.tokenExpiresAt &&
      new Date() < this.tokenExpiresAt
    ) {
      return this.accessToken;
    }

    try {
      this.logger.log("Getting new access token from Kyivstar...");
      const response: AxiosResponse<KyivstarTokenResponse> = await axios.post(
        "https://api-gateway.kyivstar.ua/idp/oauth2/token",
        // `${this.apiUrl}/idp/oauth2/token`,
        {
          grant_type: "client_credentials",
        },
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: false,
        }
      );

      this.accessToken = response.data.access_token;

      this.tokenExpiresAt = new Date(
        Date.now() + (response.data.expires_in - 300) * 1000
      );

      this.logger.log("Access token obtained successfully");
      return this.accessToken;
    } catch (error) {
      this.logger.error(
        "Failed to get access token from Kyivstar:",
        error.response?.data || error.message
      );
      return null;
    }
  }
}
