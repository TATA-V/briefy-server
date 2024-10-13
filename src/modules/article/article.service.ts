import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleModel } from 'src/entity/article.entity';
import { Repository } from 'typeorm';
import { getImageFromArticle } from 'src/utils/getImage';
import { ConfigService } from '@nestjs/config';
import { GetAll } from 'src/dto/article.dto';
import { getContentFromArticle } from 'src/utils/getContent';

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
          const htmlRes = await fetch(item.link);
          const html = await htmlRes.text();

          const thumbnail = getImageFromArticle({ html, link: item.link });
          const content = getContentFromArticle({ html });
          return { ...item, content, thumbnail };
        } catch (error) {
          return { ...item, content: null, thumbnail: null };
        }
      }),
    );

    return {
      keyword,
      ...itemsWithImageAndContent,
    };
  }
  // {
  //   title: string;
  //   originallink: string;
  //   link: string;
  //   description: string;
  //   content: string;
  //   pubDate: string;
  //   thumbnail: string;
  // }

  getOne() {}
}
