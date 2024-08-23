import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateOne, ChangeRole } from 'src/dto/user.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { RolesEnum } from 'src/types/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  getAll() {
    return this.userService.getAll();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.getOne(req.uer.id);
  }

  @Patch('profile')
  updateProfile(@Body() body: UpdateOne, @Request() req) {
    return this.updateOne(req.user.id, body);
  }

  @Delete('profile')
  deleteProfile(@Request() req) {
    return this.deleteOne(req.user.id, req.user.email);
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.getOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateOne) {
    return this.updateOne(id, body);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  deleteOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.deleteOne(id, req.user.email);
  }

  @Patch('change-role/:id')
  @Roles(RolesEnum.ADMIN)
  changeRole(@Param('id', ParseIntPipe) id: number, @Body() body: ChangeRole) {
    return this.changeRole(id, body);
  }
}
