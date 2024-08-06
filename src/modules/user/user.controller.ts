import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IsAdminGuard, IsMineOrAdminGuard } from 'src/guard/is-mine-or-admin.guard';
import { UpdateOne, ChangeRole } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(IsAdminGuard)
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
  @UseGuards(IsAdminGuard)
  changeRole(@Param('id', ParseIntPipe) id: number, @Body() body: ChangeRole) {
    return this.changeRole(id, body);
  }
}
