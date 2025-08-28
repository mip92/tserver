import { IsOptional, IsString, IsEnum } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { BrandSortField, BasePaginationDto } from "../../shared/types";

@InputType()
export class BrandsQueryDto extends BasePaginationDto {
  @Field(() => BrandSortField, {
    nullable: true,
    defaultValue: BrandSortField.ID,
  })
  @IsOptional()
  @IsEnum(BrandSortField)
  sortBy?: BrandSortField = BrandSortField.ID;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
