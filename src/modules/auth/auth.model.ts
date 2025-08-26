import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { RoleBasic } from "../shared/types";

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  refreshToken: string;
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
