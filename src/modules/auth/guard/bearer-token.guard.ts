import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extrackTokenFromHeader(rawToken, true);
    const tokenPayload = this.authService.verifyToken(token);
    const user = await this.authService.authenticateWithEmail(tokenPayload.email);

    req.user = user;
    req.token = token;
    req.tokenType = tokenPayload.type;

    return true;
  }
}
