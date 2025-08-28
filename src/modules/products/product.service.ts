import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  ProductWithBrand,
  ProductInput,
  ProductUpdateInput,
} from "./product.model";
import { ProductsQueryDto } from "./dto/products-query.dto";
import { PaginatedResponse } from "../shared/pagination.types";
import { Prisma, ProductType } from "@prisma/client";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductWithBrand[]> {
    const products = await this.prisma.product.findMany({
      include: { brand: true },
    });
    return products as ProductWithBrand[];
  }

  async findWithPagination({
    skip = 0,
    take = 10,
    sortBy,
    sortOrder,
    search,
    brandId,
    type,
    ids,
  }: ProductsQueryDto): Promise<PaginatedResponse<ProductWithBrand>> {
    const where: Prisma.ProductWhereInput = {};

    if (brandId) {
      where.brandId = brandId;
    }

    if (type) {
      where.type = type;
    }

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      const searchConditions: Prisma.ProductWhereInput[] = [
        { name: { contains: search, mode: "insensitive" } },
      ];

      const matchingTypes = Object.values(ProductType).filter((type) =>
        type.toLowerCase().includes(search.toLowerCase())
      );

      if (matchingTypes.length > 0) {
        searchConditions.push({
          type: { in: matchingTypes },
        });
      }

      where.OR = searchConditions;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || "asc";
    }

    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { brand: true },
        orderBy,
        skip,
        take,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      rows,
      total,
    };
  }

  async findById(id: number): Promise<ProductWithBrand> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { brand: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product as ProductWithBrand;
  }

  async findByBrandId(brandId: number): Promise<ProductWithBrand[]> {
    const products = await this.prisma.product.findMany({
      where: { brandId },
      include: { brand: true },
    });
    return products as ProductWithBrand[];
  }

  async findByType(type: ProductType): Promise<ProductWithBrand[]> {
    const products = await this.prisma.product.findMany({
      where: { type },
      include: { brand: true },
    });
    return products as ProductWithBrand[];
  }

  async createProduct(productData: ProductInput): Promise<ProductWithBrand> {
    const product = await this.prisma.product.create({
      data: productData,
      include: { brand: true },
    });

    return product as ProductWithBrand;
  }

  async updateProduct(
    id: number,
    productData: ProductUpdateInput
  ): Promise<ProductWithBrand> {
    const product = await this.prisma.product.update({
      where: { id },
      data: productData,
      include: { brand: true },
    });

    return product as ProductWithBrand;
  }

  async deleteProduct(id: number): Promise<ProductWithBrand> {
    const product = await this.prisma.product.delete({
      where: { id },
      include: { brand: true },
    });

    return product as ProductWithBrand;
  }

  async findByIds(ids: number[]): Promise<ProductWithBrand[]> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      include: { brand: true },
    });
    return products as ProductWithBrand[];
  }
}
