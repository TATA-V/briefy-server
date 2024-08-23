import { BaseModel } from 'src/entity/base.entity';
import { RolesEnum } from 'src/types/user';
import { Category } from 'src/types/category';
import { IsArray, IsEmail, IsEnum, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserModel extends BaseModel {
  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column('simple-array', { default: '' })
  @IsArray()
  @IsEnum(Category, { each: true })
  interest: Category[] = [];

  @Column({
    enum: Object.keys(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
