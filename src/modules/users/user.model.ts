import { Field, Int, ObjectType, InputType } from "@nestjs/graphql";

@ObjectType()
export class User {
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

@ObjectType()
export class UserWithTeams extends User {
  @Field((type) => [TeamBasic], { nullable: true })
  teams: TeamBasic[];
}

@ObjectType()
export class TeamBasic {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class UserInput {
  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field(() => Int, { nullable: true })
  teamId?: number;
}
