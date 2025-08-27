import { Field, ObjectType, Int } from "@nestjs/graphql";
import { ProductWithBrand } from "../product.model";

@ObjectType()
export class PaginatedProductsResponse {
  @Field(() => [ProductWithBrand])
  rows: ProductWithBrand[];

  @Field(() => Int)
  total: number;
}
