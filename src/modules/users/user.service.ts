import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserWithRole, UserInput, UserUpdateInput } from "./user.model";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserWithRole[]> {
    const users = await this.prisma.user.findMany({
      include: { role: true },
    });
    return users as UserWithRole[];
  }

  async findById(id: number): Promise<UserWithRole> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user as UserWithRole;
  }

  async findByEmail(email: string): Promise<UserWithRole | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return user as UserWithRole | null;
  }

  async createUser(userData: UserInput): Promise<UserWithRole> {
    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      include: { role: true },
    });

    return user as UserWithRole;
  }

  async updateUser(
    id: number,
    userData: UserUpdateInput
  ): Promise<UserWithRole> {
    const updateData: any = { ...userData };

    // Если обновляется пароль, хешируем его
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    return user as UserWithRole;
  }

  async deleteUser(id: number): Promise<UserWithRole> {
    const user = await this.prisma.user.delete({
      where: { id },
      include: { role: true },
    });

    return user as UserWithRole;
  }

  async findByIds(ids: number[]): Promise<UserWithRole[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      include: { role: true },
    });
    return users as UserWithRole[];
  }

  async assignRole(userId: number, roleId: number): Promise<UserWithRole> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true },
    });

    return user as UserWithRole;
  }

  async removeRole(userId: number): Promise<UserWithRole> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { roleId: null },
      include: { role: true },
    });

    return user as UserWithRole;
  }
}
