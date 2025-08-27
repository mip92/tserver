import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";
import { ProductType } from "@prisma/generated";

@ObjectType()
export class Brand {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field(() => ProductType)
  type: ProductType;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  brandId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ProductWithBrand extends Product {
  @Field(() => Brand)
  brand: Brand;
}

@InputType()
export class ProductInput {
  @Field(() => ProductType)
  type: ProductType;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  brandId: number;
}

@InputType()
export class ProductUpdateInput {
  @Field(() => ProductType, { nullable: true })
  type?: ProductType;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  brandId?: number;
}
