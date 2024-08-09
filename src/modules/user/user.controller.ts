import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IsMineOrAdminGuard } from 'src/guard/is-mine-or-admin.guard';
import { UpdateOne, ChangeRole } from 'src/dto/user.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { RolesEnum } from 'src/types/user.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @UseGuards(IsMineOrAdminGuard)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.getOne(id);
  }

  @Patch(':id')
  @UseGuards(IsMineOrAdminGuard)
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateOne) {
    return this.updateOne(id, body);
  }

  @Delete(':id')
  @UseGuards(IsMineOrAdminGuard)
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.deleteOne(id);
  }

  @Patch('change-role/:id')
  @Roles(RolesEnum.ADMIN)
  changeRole(@Param('id', ParseIntPipe) id: number, @Body() body: ChangeRole) {
    return this.changeRole(id, body);
  }
}
