import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { BoxType } from "../shared/box-type.types";
import { Box } from "../shared/box.types";

@ObjectType()
export class BoxTypeWithBoxes extends BoxType {
  @Field(() => [Box])
  boxes: Box[];
}

@InputType()
export class BoxTypeInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  type: string;

  @Field(() => Int, { defaultValue: 0 })
  quantity: number;
}

@InputType()
export class BoxTypeUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  quantity?: number;
}
