import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Role, RoleInput, RoleUpdateInput } from "./role.model";
import { RoleService } from "./role.service";
import { RoleType } from "@prisma/client";

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role], { name: "roles", nullable: true })
  async getRoles() {
    return this.roleService.findAll();
  }

  @Query(() => Role, { name: "role", nullable: true })
  async getRoleById(@Args({ name: "id", type: () => Int }) id: number) {
    return this.roleService.findById(id);
  }

  @Query(() => Role, { name: "roleByName", nullable: true })
  async getRoleByName(
    @Args({ name: "name", type: () => RoleType }) name: RoleType
  ) {
    return this.roleService.findByName(name);
  }

  @Mutation(() => Role, { name: "createRole" })
  async createRole(@Args("data") input: RoleInput): Promise<Role> {
    return this.roleService.createRole(input);
  }

  @Mutation(() => Role, { name: "updateRole" })
  async updateRole(
    @Args({ name: "id", type: () => Int }) id: number,
    @Args("data") input: RoleUpdateInput
  ): Promise<Role> {
    return this.roleService.updateRole(id, input);
  }

  @Mutation(() => Role, { name: "deleteRole" })
  async deleteRole(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<Role> {
    return this.roleService.deleteRole(id);
  }

  @Mutation(() => Role, { name: "assignRoleToUser" })
  async assignRoleToUser(
    @Args({ name: "roleId", type: () => Int }) roleId: number,
    @Args({ name: "userId", type: () => Int }) userId: number
  ) {
    return this.roleService.assignRoleToUser(roleId, userId);
  }

  @Mutation(() => Role, { name: "removeRoleFromUser" })
  async removeRoleFromUser(
    @Args({ name: "roleId", type: () => Int }) roleId: number,
    @Args({ name: "userId", type: () => Int }) userId: number
  ) {
    return this.roleService.removeRoleFromUser(roleId, userId);
  }
}
