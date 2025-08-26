import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { UserBasic } from "../shared/types";

@ObjectType()
export class Role {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
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
  name: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class RoleUpdateInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
