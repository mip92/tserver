import {
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SortOrder } from "./sort.types";

@InputType()
export class BasePaginationDto {
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

  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  ids?: number[];
}

