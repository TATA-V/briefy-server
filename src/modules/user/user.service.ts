import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InsertOne, UpdateOne } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
  ) {}

  async insertOne(user: InsertOne) {
    try {
      return await this.repo.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('중복된 사용자가 이미 존재합니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async deleteOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    await this.repo.delete(id);
    return;
  }

  async updateOne(id: number, body: UpdateOne) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    Object.assign(user, body);
    await this.repo.save(user);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    return user;
  }
}
