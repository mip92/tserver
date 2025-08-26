import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleInput, RoleUpdateInput } from "./role.model";

@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.roleService.findById(id);
  }

  @Post()
  create(@Body() createRoleDto: RoleInput) {
    return this.roleService.createRole(createRoleDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRoleDto: RoleUpdateInput
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.roleService.deleteRole(id);
  }
}
