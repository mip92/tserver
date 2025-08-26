import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Team {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class TeamWithMembers extends Team {
  @Field(() => [UserBasic], { nullable: true })
  members: UserBasic[];
}

@ObjectType()
export class UserBasic {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class TeamInput {
  @Field({ nullable: false })
  name: string;
}
