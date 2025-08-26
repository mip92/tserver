import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import {
  Product,
  ProductWithBrand,
  ProductInput,
  ProductUpdateInput,
} from "./product.model";
import { GraphQLAuthGuard } from "../auth/guards/graphql-auth.guard";
import { AdminRoleGuard } from "../auth/guards/admin-role.guard";
import { AdminRole } from "../auth/decorators/admin-role.decorator";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductWithBrand])
  async products(): Promise<ProductWithBrand[]> {
    return this.productService.findAll();
  }

  @Query(() => ProductWithBrand)
  async product(
    @Args("id", { type: () => Int }) id: number
  ): Promise<ProductWithBrand> {
    return this.productService.findById(id);
  }

  @Query(() => [ProductWithBrand])
  async productsByBrand(
    @Args("brandId", { type: () => Int }) brandId: number
  ): Promise<ProductWithBrand[]> {
    return this.productService.findByBrandId(brandId);
  }

  @Query(() => [ProductWithBrand])
  async productsByType(
    @Args("type") type: string
  ): Promise<ProductWithBrand[]> {
    return this.productService.findByType(type);
  }

  @Mutation(() => ProductWithBrand)
  @UseGuards(GraphQLAuthGuard, AdminRoleGuard)
  @AdminRole()
  async createProduct(
    @Args("input") input: ProductInput
  ): Promise<ProductWithBrand> {
    return this.productService.createProduct(input);
  }

  @Mutation(() => ProductWithBrand)
  @UseGuards(GraphQLAuthGuard, AdminRoleGuard)
  @AdminRole()
  async updateProduct(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: ProductUpdateInput
  ): Promise<ProductWithBrand> {
    return this.productService.updateProduct(id, input);
  }

  @Mutation(() => ProductWithBrand)
  @UseGuards(GraphQLAuthGuard, AdminRoleGuard)
  @AdminRole()
  async deleteProduct(
    @Args("id", { type: () => Int }) id: number
  ): Promise<ProductWithBrand> {
    return this.productService.deleteProduct(id);
  }
}
