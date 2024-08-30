import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertOne, UpdateOne } from 'src/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { BasePaginate } from 'src/dto/base-paginate.dto';
import { CommonService } from 'src/modules/common/common.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}

  async insertOne(user: InsertOne) {
    const existUser = await this.repo.findOne({ where: { email: user.email } });
    if (existUser) return existUser;
    return await this.repo.save(user);
  }

  async getAll(dto: BasePaginate) {
    return this.commonService.paginate({ dto, repo: this.repo, path: 'user' });
  }

  async getOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async deleteOne(id: number, loginUserEmail: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    const defaultAdmin = this.configService.get('ADMIN_EMAIL');
    if (user.email === defaultAdmin && loginUserEmail !== defaultAdmin) {
      throw new ForbiddenException('이 작업을 수행할 권한이 없습니다.');
    }
    await this.repo.delete(id);
    return id;
  }

  async getUserByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    return user;
  }

  async updateOne(id: number, body: UpdateOne) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    Object.assign(user, body);
    const updateUser = await this.repo.save(user);
    return updateUser;
  }

  async changeRole(id: number, role: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    Object.assign(user, { role });
    const updateUser = await this.repo.save(user);
    return updateUser;
  }
}
