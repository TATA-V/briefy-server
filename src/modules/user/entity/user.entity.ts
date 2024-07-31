import { BaseModel } from 'src/modules/common/entity/base.entity';
import { InterestRole } from 'src/modules/user/role/user.role';
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
  @IsEnum(InterestRole, { each: true })
  interest: InterestRole[] = [];
}
