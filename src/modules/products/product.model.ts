import {
  Field,
  InputType,
  ObjectType,
  Int,
  GraphQLISODateTime,
} from "@nestjs/graphql";
import { ProductType } from "@prisma/client";
import { Brand } from "../shared/brand.types";

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

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
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
