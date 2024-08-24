import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { IsPublic, Roles } from 'src/decorator/roles.decorator';
import { InsertOne, UpdateOne } from 'src/dto/newsletter.dto';
import { RolesEnum } from 'src/types/user';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Get()
  @IsPublic()
  getAll() {
    return this.newsletterService.getAll();
  }

  @Get(':id')
  @IsPublic()
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsletterService.getOne(id);
  }

  @Post()
  @Roles(RolesEnum.ADMIN)
  insertOne(@Body() body: InsertOne) {
    return this.newsletterService.insertOne(body);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateOne) {
    return this.newsletterService.updateOne(id, body);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsletterService.deleteOne(id);
  }

  @Get(':id/favorite')
  getFavorite(@Request() req) {
    return this.newsletterService.getFavorite(req.user.id);
  }

  @Post(':id/favorite')
  addFavorite(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.newsletterService.addFavorite(id, req.user.id);
  }

  @Delete(':id/favorite')
  removeFavorite(@Param('id') id: number, @Request() req) {
    return this.newsletterService.removeFavorite(id, req.user.id);
  }
}
