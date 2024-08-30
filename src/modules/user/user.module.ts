import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/entity/user.entity';
import { CommonModule } from 'src/modules/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), CommonModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
