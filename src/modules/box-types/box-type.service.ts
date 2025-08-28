import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  BoxTypeWithBoxes,
  BoxTypeInput,
  BoxTypeUpdateInput,
} from "./box-type.model";
import { BoxTypesQueryDto } from "./dto/box-types-query.dto";
import { PaginatedResponse } from "../shared/pagination.types";
import { BoxType, Prisma } from "@prisma/client";

@Injectable()
export class BoxTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<BoxType[]> {
    const boxTypes = await this.prisma.boxType.findMany();
    return boxTypes as BoxType[];
  }

  async findWithPagination({
    skip = 0,
    take = 10,
    sortBy,
    sortOrder,
    search,
    ids,
  }: BoxTypesQueryDto): Promise<PaginatedResponse<BoxType>> {
    const where: Prisma.BoxTypeWhereInput = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.BoxTypeOrderByWithRelationInput = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || "asc";
    }

    const [rows, total] = await Promise.all([
      this.prisma.boxType.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      this.prisma.boxType.count({ where }),
    ]);

    return {
      rows,
      total,
    };
  }

  async findById(id: number): Promise<BoxType> {
    const boxType = await this.prisma.boxType.findUnique({
      where: { id },
    });

    if (!boxType) {
      throw new NotFoundException(`BoxType with ID ${id} not found`);
    }

    return boxType as BoxType;
  }

  async createBoxType(boxTypeData: BoxTypeInput): Promise<BoxType> {
    const boxType = await this.prisma.boxType.create({
      data: boxTypeData,
    });

    return boxType as BoxType;
  }

  async updateBoxType(
    id: number,
    boxTypeData: BoxTypeUpdateInput
  ): Promise<BoxType> {
    const boxType = await this.prisma.boxType.update({
      where: { id },
      data: boxTypeData,
    });

    return boxType as BoxType;
  }

  async deleteBoxType(id: number): Promise<BoxType> {
    const boxType = await this.prisma.boxType.delete({
      where: { id },
    });

    return boxType as BoxType;
  }

  async findByIds(ids: number[]): Promise<BoxType[]> {
    const boxTypes = await this.prisma.boxType.findMany({
      where: { id: { in: ids } },
    });
    return boxTypes as BoxType[];
  }

  async getBoxTypesWithBoxCount(): Promise<
    (BoxType & { _count: { boxes: number } })[]
  > {
    const boxTypes = await this.prisma.boxType.findMany({
      include: {
        _count: {
          select: { boxes: true },
        },
      },
    });
    return boxTypes;
  }
}
