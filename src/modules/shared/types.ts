import { Field, Int, ObjectType, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class RoleBasic {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class UserBasic {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  email: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export * from "./brand.types";
export * from "./sort.types";
export * from "./pagination.dto";
