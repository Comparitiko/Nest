import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const validRoles = this.reflector.get<string[]>(
			META_ROLES,
			context.getHandler(),
		);

		if (!validRoles || validRoles.length === 0) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user as User;

		for (const role of user.roles) {
			if (validRoles.includes(role)) {
				return true;
			}
		}

		throw new ForbiddenException(
			`User ${user.fullName} does not have access to this resource`,
		);
	}
}
