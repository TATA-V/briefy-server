import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateOne } from 'src/dto/user.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { RolesEnum } from 'src/types/user';
import { BasePaginate } from 'src/dto/base-paginate.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  getAll(@Query() query?: BasePaginate) {
    return this.userService.getAll(query);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getOne(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Body() body: UpdateOne, @Request() req) {
    return this.userService.updateOne(req.user.id, body);
  }

  @Delete('profile')
  deleteProfile(@Request() req) {
    return this.userService.deleteOne(req.user.id, req.user.email);
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateOne) {
    return this.userService.updateOne(id, body);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  deleteOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.userService.deleteOne(id, req.user.email);
  }

  @Patch(':id/change-role')
  @Roles(RolesEnum.ADMIN)
  changeRole(@Param('id', ParseIntPipe) id: number, @Body() body: { role: RolesEnum }, @Request() req) {
    return this.userService.changeRole(id, body.role, req.user.email);
  }
}
