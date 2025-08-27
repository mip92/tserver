import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { ProductType } from "@prisma/client";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum ProductSortField {
  ID = "id",
  NAME = "name",
  TYPE = "type",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

registerEnumType(SortOrder, {
  name: "SortOrder",
  description: "Порядок сортировки",
});

registerEnumType(ProductSortField, {
  name: "ProductSortField",
  description: "Поле для сортировки продуктов",
});

registerEnumType(ProductType, {
  name: "ProductType",
  description: "Тип продукта",
});

@InputType()
export class ProductsQueryDto {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  take?: number = 10;

  @Field(() => ProductSortField, {
    nullable: true,
    defaultValue: ProductSortField.ID,
  })
  @IsOptional()
  @IsEnum(ProductSortField)
  sortBy?: ProductSortField = ProductSortField.ID;

  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brandId?: number;

  @Field(() => ProductType, { nullable: true })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  ids?: number[];
}
