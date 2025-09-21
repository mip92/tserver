export interface UserForLogin {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: { name: string };
}

export interface CurrentUser {
  id: number;
  email?: string;
  phone?: string;
  role?: string;
}

export interface UserUpdateData {
  verificationCode?: string | null;
  codeExpiresAt?: Date | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
}

export interface UserVerificationUpdateData {
  verificationCode: null;
  codeExpiresAt: null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  registrationStep?: number;
}

export interface UserGoBackUpdateData {
  firstName?: null;
  lastName?: null;
  password?: null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationCode?: null;
  codeExpiresAt?: null;
  registrationStep?: number;
}
