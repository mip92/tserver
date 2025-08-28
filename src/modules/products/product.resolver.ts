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
import { RolesGuard } from "../auth/guards/admin-role.guard";
import { Roles } from "../auth/decorators/admin-role.decorator";
import { RoleType } from "../auth/types/role.types";
import { ProductsQueryDto } from "./dto/products-query.dto";
import { PaginatedProductsResponse } from "./dto/paginated-products.dto";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductWithBrand])
  async products(): Promise<ProductWithBrand[]> {
    return this.productService.findAll();
  }

  @Query(() => PaginatedProductsResponse)
  async productsWithPagination(
    @Args("query") query: ProductsQueryDto
  ): Promise<PaginatedProductsResponse> {
    return await this.productService.findWithPagination(query);
  }

  @Query(() => ProductWithBrand)
  async product(
    @Args("id", { type: () => Int }) id: number
  ): Promise<ProductWithBrand> {
    return this.productService.findById(id);
  }

  @Mutation(() => ProductWithBrand)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN, RoleType.USER]) // Пример: доступ для админов и пользователей
  async createProduct(
    @Args("input") input: ProductInput
  ): Promise<ProductWithBrand> {
    return this.productService.createProduct(input);
  }

  @Mutation(() => ProductWithBrand)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async updateProduct(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: ProductUpdateInput
  ): Promise<ProductWithBrand> {
    return this.productService.updateProduct(id, input);
  }

  @Mutation(() => ProductWithBrand)
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN]) // Только для админов
  async deleteProduct(
    @Args("id", { type: () => Int }) id: number
  ): Promise<ProductWithBrand> {
    return this.productService.deleteProduct(id);
  }
}
