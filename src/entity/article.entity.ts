import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseModel } from 'src/entity/base.entity';
import { IsEnum, IsString } from 'class-validator';
import { ReadStatus } from 'src/types/article';
import { UserModel } from './user.entity';

@Entity()
export class ArticleModel extends BaseModel {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  keyword: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  pubDate: string;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsString()
  originallink: string;

  @Column()
  @IsString()
  thumbnail: string;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsString()
  company: string;

  @Column()
  @IsString()
  reporters: string[];

  @Column({ type: 'enum', enum: ReadStatus, default: ReadStatus.UNREAD })
  @IsEnum(ReadStatus)
  status: ReadStatus;

  @ManyToMany(() => UserModel, (author) => author.articles)
  authors: UserModel[];
}
