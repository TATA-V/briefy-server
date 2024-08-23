import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseModel } from 'src/entity/base.entity';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { Category } from 'src/types/category';
import { ReadStatus } from 'src/types/article';
import { UserModel } from './user.entity';

@Entity()
export class ArticleModel extends BaseModel {
  @Column()
  @IsString()
  title: string;

  @Column({ type: 'enum', enum: Category })
  @IsEnum(Category)
  category: Category;

  @Column()
  @IsString()
  description: string;

  @Column({ type: 'timestamptz' })
  @IsDate()
  date: Date;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsString()
  thumnail: string;

  @Column({ type: 'enum', enum: ReadStatus, default: ReadStatus.UNREAD })
  @IsEnum(ReadStatus)
  status: ReadStatus;

  @ManyToMany(() => UserModel, (author) => author.articles)
  authors: UserModel[];
}
