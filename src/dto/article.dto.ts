import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ArticleModel } from 'src/entity/article.entity';
import { BasePaginate } from 'src/dto/base-paginate.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Sort } from 'src/types/article';

export class InsertOne extends OmitType(ArticleModel, ['id', 'updateAt', 'createAt']) {}

export class UpdateOne extends PartialType(OmitType(ArticleModel, ['id', 'updateAt', 'createAt'])) {}

export class PaginateArticle extends BasePaginate {
  @IsString()
  @IsOptional()
  where__keyword?: string;
}

export class GetAll {
  @IsString()
  keyword: string;

  @IsEnum(Sort)
  @IsOptional()
  sort?: Sort = Sort.DATE;

  @IsNumber()
  @IsOptional()
  display?: number = 20;

  @IsNumber()
  @IsOptional()
  page?: number = 1;
}
