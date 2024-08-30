import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertOne, PaginateNewsletter, UpdateOne } from 'src/dto/newsletter.dto';
import { NewsletterModel } from 'src/entity/newsletter.entity';
import { UserModel } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/modules/common/common.service';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterModel)
    private readonly repo: Repository<NewsletterModel>,
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
    private readonly commonService: CommonService,
  ) {}

  async getAll(dto: PaginateNewsletter) {
    return this.commonService.paginate({ dto, repo: this.repo, path: 'newsletter' });
  }

  async getOne(id: number) {
    const newsletter = await this.repo.findOne({ where: { id } });
    if (!newsletter) {
      throw new NotFoundException();
    }
    return newsletter;
  }

  async insertOne(body: InsertOne) {
    const existNewsletter = await this.repo.findOne({ where: { title: body.title } });
    if (existNewsletter) {
      throw new BadRequestException('이미 존재하는 뉴스레터입니다.');
    }
    return await this.repo.save(body);
  }

  async updateOne(id: number, body: UpdateOne) {
    const newsletter = await this.repo.findOne({ where: { id } });
    if (!newsletter) {
      throw new NotFoundException();
    }
    Object.assign(newsletter, body);
    const update = await this.repo.save(body);
    return update;
  }

  async deleteOne(id: number) {
    const newsletter = await this.repo.findOne({ where: { id } });
    if (!newsletter) {
      throw new NotFoundException();
    }
    await this.repo.delete(id);
    return id;
  }

  async getFavorite(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['newsletters'] });
    if (!user) {
      throw new NotFoundException();
    }
    return user.newsletters;
  }

  async addFavorite(id: number, userId: number) {
    const newsletter = await this.repo.findOne({ where: { id }, relations: ['authors'] });
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['newsletters'] });

    if (!newsletter || !user) {
      throw new NotFoundException();
    }

    await this.userRepo.save({ ...user, newsletters: [...user.newsletters, { id: id }] });
    return id;
  }

  async deleteFavorite(id: number, userId: number) {
    const newsletter = await this.repo.findOne({ where: { id }, relations: ['authors'] });
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['newsletters'] });

    if (!newsletter || !user) {
      throw new NotFoundException();
    }

    user.newsletters = user.newsletters.filter((letter) => letter.id !== id);
    await this.userRepo.save(user);
    return id;
  }
}
