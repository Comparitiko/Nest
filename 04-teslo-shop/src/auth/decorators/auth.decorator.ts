import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { VALID_ROLES } from '../interfaces/valid-roles';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: VALID_ROLES[]) {
	return applyDecorators(
		RoleProtected(...roles),
		UseGuards(AuthGuard(), UserRoleGuard),
	);
}
