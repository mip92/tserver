import { Field, ObjectType, Int } from "@nestjs/graphql";
import { ProductWithBrand } from "../product.model";
import { PaginatedResponse } from "../../shared";

@ObjectType()
export class PaginatedProductsResponse
  implements PaginatedResponse<ProductWithBrand>
{
  @Field(() => [ProductWithBrand])
  rows: ProductWithBrand[];

  @Field(() => Int)
  total: number;
}
