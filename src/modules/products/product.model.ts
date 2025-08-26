import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class Brand {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  type: string;

  @Field()
  name: string;

  @Field(() => Int)
  brandId: number;

  @Field(() => Brand)
  brand: Brand;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProductWithBrand extends Product {
  @Field(() => Brand)
  brand: Brand;
}

@InputType()
export class ProductInput {
  @Field()
  type: string;

  @Field()
  name: string;

  @Field(() => Int)
  brandId: number;
}

@InputType()
export class ProductUpdateInput {
  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  brandId?: number;
}
