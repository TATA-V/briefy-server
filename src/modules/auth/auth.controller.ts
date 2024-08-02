import { Controller, Post, Headers, Req, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  postToken(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Headers('authorization') rawToken: string) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token이 만료되었습니다.');
    }

    const token = this.authService.extrackTokenFromHeader(rawToken, true);
    const newAccessToken = this.authService.rotateToken(token, false);
    const newRefreshToken = this.authService.rotateToken(token, true);

    res.header('authorization', `Bearer ${newAccessToken}`);
    res.cookie('refresh_token', `Bearer ${newRefreshToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    return true;
  }
}
