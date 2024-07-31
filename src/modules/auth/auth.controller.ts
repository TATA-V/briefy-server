import { Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  postToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extrackTokenFromHeader(rawToken, true);
    const newAccessToken = this.authService.rotateToken(token, false);
    const newRefreshToken = this.authService.rotateToken(token, true);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
