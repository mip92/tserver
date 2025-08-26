import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Team, TeamInput, TeamWithMembers } from "./team.model";
import { UserService } from "../users/user.service";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  findAll(): Promise<TeamWithMembers[]> {
    return this.prisma.team.findMany({
      include: { members: true },
    }) as Promise<TeamWithMembers[]>;
  }

  findById(id: number): Promise<TeamWithMembers | null> {
    return this.prisma.team.findUnique({
      where: { id },
      include: { members: true },
    }) as Promise<TeamWithMembers | null>;
  }

  findByIds(ids: number[]): Promise<TeamWithMembers[]> {
    return this.prisma.team.findMany({
      where: { id: { in: ids } },
      include: { members: true },
    }) as Promise<TeamWithMembers[]>;
  }

  createTeam(data: TeamInput): Promise<TeamWithMembers> {
    return this.prisma.team.create({
      data: { name: data.name },
      include: { members: true },
    }) as Promise<TeamWithMembers>;
  }

  async addMember(teamId: number, userId: number): Promise<TeamWithMembers | null> {
    const team = await this.findById(teamId);
    if (!team) return null;

    const user = await this.userService.findById(userId);
    if (user) {
      await this.prisma.team.update({
        where: { id: teamId },
        data: {
          members: {
            connect: { id: userId },
          },
        },
        include: { members: true },
      });
    }

    return this.findById(teamId);
  }

  async removeMember(teamId: number, userId: number): Promise<TeamWithMembers | null> {
    await this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    return this.findById(teamId);
  }
}
