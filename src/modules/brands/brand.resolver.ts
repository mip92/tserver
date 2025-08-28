import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandWithProducts, BrandInput, BrandUpdateInput } from "./brand.model";
import { GraphQLAuthGuard } from "../auth/guards/graphql-auth.guard";
import { RolesGuard } from "../auth/guards/admin-role.guard";
import { Roles } from "../auth/decorators/admin-role.decorator";
import { RoleType } from "../auth/types/role.types";
import { BrandsQueryDto } from "./dto/brands-query.dto";
import { PaginatedBrandsResponse } from "./dto/paginated-brands.dto";
import { Brand } from "../shared";

@Resolver(() => Brand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}

  @Query(() => PaginatedBrandsResponse)
  async brandsWithPagination(
    @Args("query") query: BrandsQueryDto
  ): Promise<PaginatedBrandsResponse> {
    return await this.brandService.findWithPagination(query);
  }

  @Query(() => Brand)
  async brand(@Args("id", { type: () => Int }) id: number): Promise<Brand> {
    return this.brandService.findById(id);
  }

  @Mutation(() => Brand)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async createBrand(@Args("input") input: BrandInput): Promise<Brand> {
    return this.brandService.createBrand(input);
  }

  @Mutation(() => Brand)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async updateBrand(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: BrandUpdateInput
  ): Promise<Brand> {
    return this.brandService.updateBrand(id, input);
  }

  @Mutation(() => Brand)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async deleteBrand(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Brand> {
    return this.brandService.deleteBrand(id);
  }
}
