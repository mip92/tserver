import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  ProductWithBrand,
  ProductInput,
  ProductUpdateInput,
  ProductGetAll,
} from "./product.model";
import { ProductsQueryDto } from "./dto/products-query.dto";
import { PaginatedResponse } from "../shared/pagination.types";
import { Prisma, ProductType } from "@prisma/client";
import { FileStorageService } from "../file-storage/file-storage.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService
  ) {}

  private async addUrlToFiles(files: any[]): Promise<any[]> {
    const filesWithUrls = [];
    for (const file of files) {
      const fileWithUrl = {
        ...file,
        url: await this.fileStorageService.getSignedUrl(file.s3Key, 3600),
      };
      filesWithUrls.push(fileWithUrl);
    }
    return filesWithUrls;
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
  }: ProductsQueryDto): Promise<PaginatedResponse<ProductGetAll>> {
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
        include: {
          brand: true,
          files: {
            where: { type: "MAIN" },
            orderBy: { order: "asc" },
            take: 1,
          },
        },
        orderBy,
        skip,
        take,
      }),
      this.prisma.product.count({ where }),
    ]);

    const rowsWithUrls = [];
    for (const product of rows) {
      const productWithUrl = {
        ...product,
        mainFile: product.files?.[0]
          ? {
              ...product.files[0],
              url: await this.fileStorageService.getSignedUrl(
                product.files[0].s3Key,
                3600
              ),
            }
          : null,
      };
      rowsWithUrls.push(productWithUrl);
    }

    return {
      rows: rowsWithUrls,
      total,
    };
  }

  async findById(id: number): Promise<ProductWithBrand> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        files: {
          orderBy: [
            { type: "asc" }, // MAIN comes before GALLERY alphabetically
            { order: "asc" },
          ],
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const filesWithUrls = await this.addUrlToFiles(product.files || []);

    return {
      ...product,
      files: filesWithUrls,
    };
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
