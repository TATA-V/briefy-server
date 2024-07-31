import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class SocialService {
  constructor(private readonly userService: UserService) {}

  async socialLogin(req: any) {
    if (!req.user) {
      throw new InternalServerErrorException('이메일이 존재하지 않습니다.');
    }
    const { name, email } = req.user._json;
    const user = await this.userService.insertOne({ name, email });

    return user;
  }
}
