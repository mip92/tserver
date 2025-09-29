import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, Matches } from "class-validator";

@InputType()
export class SendSmsInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^(\+380|380|0)\d{9}$/, {
    message: "Please provide a valid Ukrainian phone number",
  })
  phoneNumber: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "Message is required" })
  message: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sender?: string;
}

@InputType()
export class SendVerificationCodeInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^(\+380|380|0)\d{9}$/, {
    message: "Please provide a valid Ukrainian phone number",
  })
  phoneNumber: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "Code is required" })
  @Matches(/^\d{4}$/, {
    message: "Code must be exactly 4 digits",
  })
  code: string;
}

@InputType()
export class SendPasswordResetCodeInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^(\+380|380|0)\d{9}$/, {
    message: "Please provide a valid Ukrainian phone number",
  })
  phoneNumber: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "Code is required" })
  @Matches(/^\d{4}$/, {
    message: "Code must be exactly 4 digits",
  })
  code: string;
}

@ObjectType()
export class SmsResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  messageId?: string;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class SmsBalanceResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  balance?: number;

  @Field({ nullable: true })
  error?: string;
}


