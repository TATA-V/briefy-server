import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../types/user.type';

export const ROLES_KEY = 'roles';
export const IS_PUBLIC = 'is_public';

export const Roles = (role: RolesEnum) => SetMetadata(ROLES_KEY, role);
export const IsPublic = () => SetMetadata(IS_PUBLIC, true);
