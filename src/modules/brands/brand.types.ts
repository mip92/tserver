import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class BrandWithProductCount {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  productCount: number;
}

@ObjectType()
export class BrandStats {
  @Field(() => Int)
  totalBrands: number;

  @Field(() => Int)
  totalProducts: number;

  @Field(() => [BrandWithProductCount])
  topBrands: BrandWithProductCount[];
}

