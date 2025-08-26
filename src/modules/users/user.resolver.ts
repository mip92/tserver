import { Int, Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { User, UserInput, UserUpdateInput } from "./user.model";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: "users", nullable: false })
  async getUsers() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: "user", nullable: true })
  async getUserById(@Args({ name: "id", type: () => Int }) id: number) {
    return this.userService.findById(id);
  }

  @Mutation(() => User, { name: "createUser" })
  async createUser(@Args("data") input: UserInput): Promise<User> {
    return this.userService.createUser(input);
  }

  @Mutation(() => User, { name: "updateUser" })
  async updateUser(
    @Args({ name: "id", type: () => Int }) id: number,
    @Args("data") input: UserUpdateInput
  ): Promise<User> {
    return this.userService.updateUser(id, input);
  }

  @Mutation(() => User, { name: "deleteUser" })
  async deleteUser(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Mutation(() => User, { name: "assignRole" })
  async assignRole(
    @Args({ name: "userId", type: () => Int }) userId: number,
    @Args({ name: "roleId", type: () => Int }) roleId: number
  ): Promise<User> {
    return this.userService.assignRole(userId, roleId);
  }

  @Mutation(() => User, { name: "removeRole" })
  async removeRole(
    @Args({ name: "userId", type: () => Int }) userId: number
  ): Promise<User> {
    return this.userService.removeRole(userId);
  }
}
