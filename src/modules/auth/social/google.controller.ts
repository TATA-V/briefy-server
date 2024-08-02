import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { SocialService } from './social.service';
import { ConfigService } from '@nestjs/config';
import { IsPublic } from 'src/decorator/roles.decorator';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialService: SocialService,
    private readonly configService: ConfigService,
  ) {}

  @IsPublic()
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.socialService.socialLogin(req);

    if ('email' in user) {
      const { accessToken, refreshToken } = this.authService.loginUser({ id: user.id, email: user.email });

      res.header('authorization', `Bearer ${accessToken}`);

      res.cookie('refresh_token', `Bearer ${refreshToken}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });
    }

    res.redirect(`${this.configService.get('CLIENT_BASE_URL')}`);
  }
}
