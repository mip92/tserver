import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Brand } from "../../shared/brand.types";
import { PaginatedResponse } from "../../shared";

@ObjectType()
export class PaginatedBrandsResponse implements PaginatedResponse<Brand> {
  @Field(() => [Brand])
  rows: Brand[];

  @Field(() => Int)
  total: number;
}

