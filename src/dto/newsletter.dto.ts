import { OmitType, PartialType } from '@nestjs/mapped-types';
import { NewsletterModel } from 'src/entity/newsletter.entity';

export class InsertOne extends OmitType(NewsletterModel, ['id', 'updateAt', 'createAt']) {}

export class UpdateOne extends PartialType(OmitType(NewsletterModel, ['id', 'updateAt', 'createAt'])) {}
