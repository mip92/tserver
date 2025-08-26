import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserInput, UserUpdateInput, UserWithRole } from "./user.model";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<UserWithRole[]> {
    return this.prisma.user.findMany({
      include: { role: true },
    }) as any;
  }

  findById(id: number): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    }) as any;
  }

  findByEmail(email: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    }) as any;
  }

  async createUser(data: UserInput): Promise<UserWithRole> {
    const user = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        roleId: data.roleId,
      },
      include: { role: true },
    }) as any;

    return user;
  }

  async updateUser(id: number, data: UserUpdateInput): Promise<UserWithRole | null> {
    const updateData: any = {};
    
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.roleId !== undefined) updateData.roleId = data.roleId;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    }) as any;
  }

  deleteUser(id: number): Promise<UserWithRole> {
    return this.prisma.user.delete({
      where: { id },
      include: { role: true },
    }) as any;
  }

  findByIds(ids: number[]): Promise<UserWithRole[]> {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      include: { role: true },
    }) as any;
  }

  async assignRole(userId: number, roleId: number): Promise<UserWithRole | null> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true },
    }) as any;
  }

  async removeRole(userId: number): Promise<UserWithRole | null> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { roleId: null },
      include: { role: true },
    }) as any;
  }
}
