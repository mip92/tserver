import { Field, ObjectType, Int, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class Brand {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

