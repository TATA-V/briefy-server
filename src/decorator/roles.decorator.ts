import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../types/user.type';

export const Roles = (role: RolesEnum) => SetMetadata('roles', role);
export const IsPublic = () => SetMetadata('is_public', true);
