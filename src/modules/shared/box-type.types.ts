import { Field, ObjectType, Int, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class BoxType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  type: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
