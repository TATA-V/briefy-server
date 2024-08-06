import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RolesEnum } from 'src/types/user.type';

@Injectable()
export class IsAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { user } = req;
    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
    }
    if (user.role !== RolesEnum.ADMIN) {
      throw new ForbiddenException('관리자 권한이 없습니다.');
    }
    return true;
  }
}

export class IsMineOrAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user.role === RolesEnum.ADMIN) {
      return true;
    }
    const userId = req.params.id;
    if (!userId) {
      throw new BadRequestException('User ID가 파라미터로 제공되어야 합니다.');
    }
    if (req.user.id !== +userId) {
      throw new ForbiddenException('본인 계정만 조회하거나 수정할 수 있습니다.');
    }

    return true;
  }
}
