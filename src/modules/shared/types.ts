import { Field, Int, ObjectType } from "@nestjs/graphql";

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
