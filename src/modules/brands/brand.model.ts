import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Brand } from "../shared/brand.types";
import { Product } from "../products/product.model";

@ObjectType()
export class BrandWithProducts extends Brand {
  @Field(() => [Product])
  products: Product[];
}

@InputType()
export class BrandInput {
  @Field(() => String)
  name: string;
}

@InputType()
export class BrandUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;
}
