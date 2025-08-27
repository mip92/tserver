import {
  Field,
  InputType,
  Int,
  ObjectType,
  GraphQLISODateTime,
  registerEnumType,
} from "@nestjs/graphql";
import { UserBasic } from "../shared/types";
import { RoleType } from "@prisma/client";

registerEnumType(RoleType, {
  name: "RoleType",
  description: "Тип роли",
});

@ObjectType()
export class Role {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class RoleWithUsers extends Role {
  @Field(() => [UserBasic], { nullable: true })
  users: UserBasic[];
}

@InputType()
export class RoleInput {
  @Field({ nullable: false })
  name: RoleType;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class RoleUpdateInput {
  @Field({ nullable: true })
  name?: RoleType;

  @Field({ nullable: true })
  description?: string;
}
