import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { BoxTypeService } from "./box-type.service";
import {
  BoxTypeWithBoxes,
  BoxTypeInput,
  BoxTypeUpdateInput,
} from "./box-type.model";
import { GraphQLAuthGuard } from "../auth/guards/graphql-auth.guard";
import { RolesGuard } from "../auth/guards/admin-role.guard";
import { Roles } from "../auth/decorators/admin-role.decorator";
import { RoleType } from "../auth/types/role.types";
import { BoxTypesQueryDto } from "./dto/box-types-query.dto";
import { PaginatedBoxTypesResponse } from "./dto/paginated-box-types.dto";
import { BoxType } from "../shared/box-type.types";

@Resolver(() => BoxType)
export class BoxTypeResolver {
  constructor(private readonly boxTypeService: BoxTypeService) {}

  @Query(() => PaginatedBoxTypesResponse)
  async boxTypesWithPagination(
    @Args("query") query: BoxTypesQueryDto
  ): Promise<PaginatedBoxTypesResponse> {
    return await this.boxTypeService.findWithPagination(query);
  }

  @Query(() => BoxType)
  async boxType(@Args("id", { type: () => Int }) id: number): Promise<BoxType> {
    return this.boxTypeService.findById(id);
  }

  @Mutation(() => BoxType)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async createBoxType(@Args("input") input: BoxTypeInput): Promise<BoxType> {
    return this.boxTypeService.createBoxType(input);
  }

  @Mutation(() => BoxType)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async updateBoxType(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: BoxTypeUpdateInput
  ): Promise<BoxType> {
    return this.boxTypeService.updateBoxType(id, input);
  }

  @Mutation(() => BoxType)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async deleteBoxType(
    @Args("id", { type: () => Int }) id: number
  ): Promise<BoxType> {
    return this.boxTypeService.deleteBoxType(id);
  }
}
