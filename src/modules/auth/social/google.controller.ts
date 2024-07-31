import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { SocialService } from './social.service';
import { ConfigService } from '@nestjs/config';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialService: SocialService,
    private readonly configService: ConfigService,
  ) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.socialService.socialLogin(req);
    console.log('user:', user);

    if ('email' in user) {
      const { accessToken, refreshToken } = this.authService.loginUser({ id: user.id, email: user.email });

      res.header('authorization', `Bearer ${accessToken}`);

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    res.redirect(`${this.configService.get('CLIENT_BASE_URL')}`);
  }
}
