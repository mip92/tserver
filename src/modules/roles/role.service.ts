import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Role, RoleInput, RoleUpdateInput, RoleWithUsers } from "./role.model";
import { RoleType } from "@prisma/client";

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<RoleWithUsers[]> {
    return this.prisma.role.findMany({
      include: { users: true },
    }) as Promise<RoleWithUsers[]>;
  }

  findById(id: number): Promise<RoleWithUsers | null> {
    return this.prisma.role.findUnique({
      where: { id },
      include: { users: true },
    }) as Promise<RoleWithUsers | null>;
  }

  findByName(name: RoleType): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  createRole(data: RoleInput): Promise<Role> {
    return this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  updateRole(id: number, data: RoleUpdateInput): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  deleteRole(id: number): Promise<Role> {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignRoleToUser(
    roleId: number,
    userId: number
  ): Promise<RoleWithUsers | null> {
    await this.prisma.role.update({
      where: { id: roleId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });

    return this.findById(roleId);
  }

  async removeRoleFromUser(
    roleId: number,
    userId: number
  ): Promise<RoleWithUsers | null> {
    await this.prisma.role.update({
      where: { id: roleId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });

    return this.findById(roleId);
  }
}
