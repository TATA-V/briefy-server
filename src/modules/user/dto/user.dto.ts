import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entity/user.entity';

export class InsertOne extends PickType(UserModel, ['name', 'email']) {}

export class UpdateOne extends PickType(UserModel, ['interest']) {}
