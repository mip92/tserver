import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TeamService } from "../teams/team.service";
import { User, UserInput, UserWithTeams } from "./user.model";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService
  ) {}

  findAll(): Promise<UserWithTeams[]> {
    return this.prisma.user.findMany({
      include: { teams: true },
    }) as Promise<UserWithTeams[]>;
  }

  findById(id: number): Promise<UserWithTeams | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { teams: true },
    }) as Promise<UserWithTeams | null>;
  }

  async createUser(data: UserInput): Promise<UserWithTeams> {
    const user = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      include: { teams: true },
    }) as UserWithTeams;

    if (data.teamId) {
      await this.teamService.addMember(data.teamId, user.id);
    }

    return user;
  }

  findByIds(ids: number[]): Promise<UserWithTeams[]> {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      include: { teams: true },
    }) as Promise<UserWithTeams[]>;
  }
}
