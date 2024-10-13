import { Controller, Get, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { IsPublic } from 'src/decorator/roles.decorator';
import { GetAll } from 'src/dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @IsPublic()
  getAll(@Query() query: GetAll) {
    return this.articleService.getAll(query);
  }

  @Get()
  @IsPublic()
  getOne() {
    return this.articleService.getOne();
  }
}
