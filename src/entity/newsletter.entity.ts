import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseModel } from 'src/entity/base.entity';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { Category } from 'src/types/category';
import { DayOfWeek } from 'src/types/dayofweek';
import { UserModel } from './user.entity';

@Entity()
export class NewsletterModel extends BaseModel {
  @Column()
  @IsString()
  title: string;

  @Column({ type: 'enum', enum: Category })
  @IsEnum(Category)
  category: Category;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsString()
  thumbnail: string;

  @Column('simple-array')
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  uploadDays: DayOfWeek[];

  @ManyToMany(() => UserModel, (author) => author.newsletters)
  authors: UserModel[];
}
