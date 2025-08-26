import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  ProductWithBrand,
  ProductInput,
  ProductUpdateInput,
} from "./product.model";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductWithBrand[]> {
    const products = await this.prisma.product.findMany({
      include: { brand: true },
    });
    return products as ProductWithBrand[];
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

  async findByType(type: string): Promise<ProductWithBrand[]> {
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
