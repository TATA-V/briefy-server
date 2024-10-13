import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModel } from 'src/entity/article.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleModel]), CommonModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
