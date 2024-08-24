import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ArticleModel } from 'src/entity/article.entity';

export class InsertOne extends OmitType(ArticleModel, ['id', 'updateAt', 'createAt']) {}

export class UpdateOne extends PartialType(OmitType(ArticleModel, ['id', 'updateAt', 'createAt'])) {}
