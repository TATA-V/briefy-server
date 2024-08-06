import { Controller, Get, Req, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IsPublic } from 'src/decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  @IsPublic()
  postToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
    }

    const token = this.authService.extrackTokenFromHeader(refreshToken, true);
    const newAccessToken = this.authService.rotateToken(token, false);
    const newRefreshToken = this.authService.rotateToken(token, true);

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', `Bearer ${newAccessToken}`, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', `Bearer ${newRefreshToken}`, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    });

    return true;
  }
}
