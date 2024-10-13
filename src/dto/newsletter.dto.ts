import { OmitType, PartialType } from '@nestjs/mapped-types';
import { NewsletterModel } from 'src/entity/newsletter.entity';
import { BasePaginate } from 'src/dto/base-paginate.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Category } from 'src/types/category';

export class InsertOne extends OmitType(NewsletterModel, ['id', 'updateAt', 'createAt']) {}

export class UpdateOne extends PartialType(OmitType(NewsletterModel, ['id', 'updateAt', 'createAt'])) {}

export class PaginateNewsletter extends BasePaginate {
  @IsEnum(Category)
  @IsOptional()
  where__category?: Category;
}
