import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";
import { RoleBasic } from "../shared/types";

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}

@ObjectType()
export class UserAuth {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

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
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @Field()
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;

  @Field()
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @Field({ nullable: true })
  phone?: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty({ message: "New password is required" })
  newPassword: string;
}

@ObjectType()
export class MessageResponse {
  @Field()
  message: string;
}
