import { IsOptional, IsString, IsEnum } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { BoxTypeSortField, BasePaginationDto } from "../../shared/types";

@InputType()
export class BoxTypesQueryDto extends BasePaginationDto {
  @Field(() => BoxTypeSortField, {
    nullable: true,
    defaultValue: BoxTypeSortField.ID,
  })
  @IsOptional()
  @IsEnum(BoxTypeSortField)
  sortBy?: BoxTypeSortField = BoxTypeSortField.ID;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
