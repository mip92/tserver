import {
  Field,
  InputType,
  ObjectType,
  Int,
  GraphQLISODateTime,
} from "@nestjs/graphql";
import { RoleBasic } from "../shared/types";

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  isActive: boolean;

  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field(() => RoleBasic, { nullable: true })
  role?: RoleBasic;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class UserWithRole extends User {
  @Field(() => RoleBasic, { nullable: true })
  role?: RoleBasic;
}

@InputType()
export class UserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}
