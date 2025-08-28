import { Field, ObjectType, Int, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class Box {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  boxTypeId: number | null;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Int, { nullable: true })
  parentBoxId: number | null;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
