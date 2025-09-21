export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsBalanceResult {
  success: boolean;
  balance?: number;
  error?: string;
}

export interface SmsProvider {
  sendSms(phoneNumber: string, message: string, sender?: string): Promise<SmsSendResult>;
  sendVerificationCode(phoneNumber: string, code: string): Promise<SmsSendResult>;
  sendPasswordResetCode(phoneNumber: string, code: string): Promise<SmsSendResult>;
  getBalance(): Promise<SmsBalanceResult>;
  validatePhoneNumber(phoneNumber: string): boolean;
}

