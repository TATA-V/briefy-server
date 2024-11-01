import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleModel } from 'src/entity/article.entity';
import { Repository } from 'typeorm';
import { extractArticleInfo } from 'src/utils/extractArticleInfo';
import { ConfigService } from '@nestjs/config';
import { GetAll } from 'src/dto/article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleModel)
    private readonly repo: Repository<ArticleModel>,
    private readonly configService: ConfigService,
  ) {}

  async getAll({ keyword, sort, display, page }: GetAll) {
    const start = (page - 1) * display + 1;
    const url = `${this.configService.get('NAVER_BASE_URL')}?query=${encodeURIComponent(keyword)}&sort=${sort}&display=${display}&start=${start}`;
    const options = {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': this.configService.get('NAVER_CLIENT_ID'),
        'X-Naver-Client-Secret': this.configService.get('NAVER_CLIENT_SECRET'),
      },
    };
    const res = await fetch(url, options);
    const data = await res.json();

    const itemsWithImageAndContent = await Promise.all(
      data.items.map(async (item: any) => {
        try {
          const { thumbnail, content, company, reporters } = await extractArticleInfo({ url: item.link });
          return { ...item, thumbnail, content, company, reporters };
        } catch (error) {
          return { ...item, thumbnail: null, content: null, company: null, reporters: [] };
        }
      }),
    );

    return {
      keyword,
      ...itemsWithImageAndContent,
    };
  }
  // {
  //   keyword: string;
  //   title: string;
  //   originallink: string;
  //   link: string;
  //   description: string;
  //   pubDate: string;
  //   thumbnail: string;
  //   content: string;
  //   company: string;
  //   reporters: string[];
  // }

  getOne() {}
}
