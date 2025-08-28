import { Field, ObjectType } from "@nestjs/graphql";
import { PaginatedResponse } from "../../shared/pagination.types";
import { BoxType } from "../../shared/box-type.types";

@ObjectType()
export class PaginatedBoxTypesResponse implements PaginatedResponse<BoxType> {
  @Field(() => [BoxType])
  rows: BoxType[];

  @Field(() => Number)
  total: number;
}
