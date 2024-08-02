import { BaseModel } from 'src/entity/base.entity';
import { Interest } from 'src/types/user.type';
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
  @IsEnum(Interest, { each: true })
  interest: Interest[] = [];
}
