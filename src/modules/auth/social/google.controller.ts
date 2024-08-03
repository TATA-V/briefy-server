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
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = await this.socialService.socialLogin(req);

    const { accessToken, refreshToken } = this.authService.loginUser({ id: user.id, email: user.email });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', `Bearer ${accessToken}`, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', `Bearer ${refreshToken}`, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    });

    res.redirect(`${this.configService.get('CLIENT_BASE_URL')}`);
  }
}
