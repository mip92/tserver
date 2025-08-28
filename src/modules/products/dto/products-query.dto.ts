import { IsOptional, IsString, IsNumber, IsEnum } from "class-validator";
import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { ProductType } from "@prisma/client";
import { ProductSortField, BasePaginationDto } from "../../shared/types";

registerEnumType(ProductType, {
  name: "ProductType",
  description: "Тип продукта",
});

@InputType()
export class ProductsQueryDto extends BasePaginationDto {
  @Field(() => ProductSortField, {
    nullable: true,
    defaultValue: ProductSortField.ID,
  })
  @IsOptional()
  @IsEnum(ProductSortField)
  sortBy?: ProductSortField = ProductSortField.ID;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  brandId?: number;

  @Field(() => ProductType, { nullable: true })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;
}
