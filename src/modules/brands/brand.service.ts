import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BrandInput, BrandUpdateInput } from "./brand.model";
import { BrandsQueryDto } from "./dto/brands-query.dto";
import { PaginatedResponse } from "../shared/pagination.types";
import { Brand, Prisma } from "@prisma/client";

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany();

    return brands;
  }

  async findWithPagination({
    skip = 0,
    take = 10,
    sortBy,
    sortOrder,
    search,
    ids,
  }: BrandsQueryDto): Promise<PaginatedResponse<Brand>> {
    const where: Prisma.BrandWhereInput = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const orderBy: Prisma.BrandOrderByWithRelationInput = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || "asc";
    }

    const [rows, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      rows,
      total,
    };
  }

  async findById(id: number): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async createBrand(brandData: BrandInput): Promise<Brand> {
    const brand = await this.prisma.brand.create({
      data: brandData,
    });

    return brand;
  }

  async updateBrand(id: number, brandData: BrandUpdateInput): Promise<Brand> {
    const brand = await this.prisma.brand.update({
      where: { id },
      data: brandData,
    });

    return brand;
  }

  async deleteBrand(id: number): Promise<Brand> {
    const brand = await this.prisma.brand.delete({
      where: { id },
    });

    return brand;
  }

  async findByIds(ids: number[]): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany({
      where: { id: { in: ids } },
    });
    return brands;
  }

  async getBrandsWithProductCount(): Promise<
    (Brand & { _count: { products: number } })[]
  > {
    const brands = await this.prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return brands;
  }
}
