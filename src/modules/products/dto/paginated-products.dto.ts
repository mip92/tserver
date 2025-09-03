import { Field, ObjectType, Int } from "@nestjs/graphql";
import { ProductGetAll, ProductWithBrand } from "../product.model";
import { PaginatedResponse } from "../../shared";

@ObjectType()
export class PaginatedProductsResponse
  implements PaginatedResponse<ProductGetAll>
{
  @Field(() => [ProductGetAll])
  rows: ProductGetAll[];

  @Field(() => Int)
  total: number;
}
