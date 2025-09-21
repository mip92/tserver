import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  ValidateIf,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { RoleBasic } from "../shared/types";
import { UkrainianPhone } from "./validators/ukrainian-phone.validator";
import { PasswordMatch } from "./validators/password-match.validator";

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email)
  @UkrainianPhone()
  phone?: string;

  @Field()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password: string;
}

@ObjectType()
export class UserAuth {
  @Field()
  id: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => RoleBasic, { nullable: true })
  role?: RoleBasic;
}

@ObjectType()
export class UserProfile {
  @Field()
  id: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => RoleBasic, { nullable: true })
  role?: RoleBasic;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => UserAuth)
  user: UserAuth;
}

@ObjectType()
export class RefreshResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field({ nullable: true })
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email)
  @UkrainianPhone()
  phone?: string;
}

@ObjectType()
export class MessageResponse {
  @Field()
  message: string;
}

// Multi-step registration models
@InputType()
export class StartRegistrationInput {
  @Field({ nullable: true })
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email)
  @UkrainianPhone()
  phone?: string;
}

@ObjectType()
export class StartRegistrationResponse {
  @Field()
  message: string;

  @Field()
  step: number;

  @Field()
  method: string; // "email" or "sms"

  @Field()
  userId: number;
}

@InputType()
export class VerifyCodeInput {
  @Field()
  @IsNotEmpty({ message: "Code is required" })
  code: string;

  @Field()
  @IsNotEmpty({ message: "User ID is required" })
  userId: number;
}

@ObjectType()
export class VerifyCodeResponse {
  @Field()
  message: string;

  @Field()
  step: number;

  @Field()
  verified: boolean;

  @Field()
  temp_token: string;
}

@InputType()
export class SetPasswordInput {
  @Field()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  password: string;

  @Field()
  @IsNotEmpty({ message: "Password confirmation is required" })
  @PasswordMatch("password", { message: "Passwords do not match" })
  confirmPassword: string;
}

@ObjectType()
export class SetPasswordResponse {
  @Field()
  message: string;

  @Field()
  step: number;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => UserAuth)
  user: UserAuth;
}

@InputType()
export class SetPersonalInfoInput {
  @Field({ nullable: true })
  @MaxLength(50, { message: "First name must not exceed 50 characters" })
  firstName?: string;

  @Field({ nullable: true })
  @MaxLength(50, { message: "Last name must not exceed 50 characters" })
  lastName?: string;
}

@ObjectType()
export class SetPersonalInfoResponse {
  @Field()
  message: string;

  @Field()
  step: number;

  @Field()
  completed: boolean;
}

@InputType()
export class ResendCodeInput {
  @Field()
  @IsNotEmpty({ message: "User ID is required" })
  userId: number;
}

@ObjectType()
export class ResendCodeResponse {
  @Field()
  message: string;

  @Field()
  canResendAt: Date;
}

@InputType()
export class GoBackStepInput {
  @Field()
  @IsNotEmpty({ message: "User ID is required" })
  userId: number;
}
