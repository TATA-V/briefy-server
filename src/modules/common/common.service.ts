import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasePaginate } from 'src/dto/base-paginate.dto';
import { BaseModel } from 'src/entity/base.entity';
import { FILTER_MAPPER } from 'src/utils/filter-mapper';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';

interface Paginate<T extends BaseModel> {
  dto: BasePaginate;
  repo: Repository<T>;
  overrideFindOptions?: FindManyOptions<T>;
  path: string;
}

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  async paginate<T extends BaseModel>({ dto, repo, path, overrideFindOptions = {} }: Paginate<T>) {
    if (dto.page) {
      return this.pagePaginate({ dto, repo, overrideFindOptions });
    } else {
      return this.cursorPaginate({ dto, repo, overrideFindOptions, path });
    }
  }

  async pagePaginate<T extends BaseModel>({ dto, repo, overrideFindOptions = {} }: Omit<Paginate<T>, 'path'>) {
    const findOptions = this.composeFindOptions<T>({ dto });
    const [data, count] = await repo.findAndCount({ ...findOptions, ...overrideFindOptions });

    return {
      data,
      total: count,
    };
  }

  async cursorPaginate<T extends BaseModel>({ dto, repo, overrideFindOptions = {}, path }: Paginate<T>) {
    const findOptions = this.composeFindOptions<T>({ dto });
    const data = await repo.find({ ...findOptions, ...overrideFindOptions });

    const lastItem = data.length > 0 && data.length === findOptions.take ? data[data.length - 1] : null;
    const nextUrl = lastItem && new URL(`${this.configService.get('BASE_URL')}/${path}`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (key !== 'where__id__more_than' && key !== 'where__id_less_than') {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }
    }

    let key = null;
    if (dto.order__createAt === 'ASC') {
      key = 'where__id__more_than';
    } else {
      key = 'where_id_less_than';
    }

    nextUrl.searchParams.append(key, lastItem.id.toString());

    return {
      data,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: data.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  composeFindOptions<T extends BaseModel>({ dto }: Pick<Paginate<T>, 'dto'>) {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = { ...where, ...this.parseWhereFilter(key, value) };
      } else if (key.startsWith('order__')) {
        order = { ...order, ...this.parseOrderFilter(key, value) };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  parseWhereFilter<T extends BaseModel>(key: string, value: string) {
    const where: FindOptionsWhere<T> = {};
    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(`where 필터의 형식이 잘못되었습니다: 키 '${key}'는 '__'로 분리했을 때 2 또는 3개의 부분이어야 합니다.`);
    }

    if (split.length === 2) {
      const [_, field] = split;
      where[field] = value;
    } else {
      const [_, field, operator] = split;
      const values = value.toString().split(',');
      where[field] = FILTER_MAPPER[operator](values.length > 1 ? values : value);
    }

    return where;
  }

  parseOrderFilter<T extends BaseModel>(key: string, value: string) {
    const order: FindOptionsOrder<T> = {};
    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(`where 필터의 형식이 잘못되었습니다: 키 '${key}'는 '__'로 분리했을 때 2 또는 3개의 부분이어야 합니다.`);
    }

    const [_, field] = split;
    order[field] = value;

    return order;
  }
}
