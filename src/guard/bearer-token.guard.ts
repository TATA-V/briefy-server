import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorator/roles.decorator';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      req.isRoutePublic = true;
      return true;
    }

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

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();
    if (req.isRoutePublic) return true;
    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('Access Token이 아닙니다.');
    }

    return true;
  }
}
