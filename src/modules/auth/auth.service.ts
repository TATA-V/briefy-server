import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  extrackTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    const token = splitToken[1];
    return token;
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return this.signToken(decoded, isRefreshToken);
  }

  async authenticateWithEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  signToken(user: Pick<UserModel, 'id' | 'email'>, isRefreshToken: boolean) {
    const payload = {
      sub: user.id,
      email: user.email,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken ? 240 : 120, // 4분, 2분 .. test용임
    });
  }

  loginUser(user: Pick<UserModel, 'id' | 'email'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }
}
