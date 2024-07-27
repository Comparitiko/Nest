import {
	Controller,
	Post,
	Body,
	Get,
	UseGuards,
	Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { RoleProtected } from './decorators/role-protected.decorator';
import { Auth } from './decorators/auth.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { VALID_ROLES } from './interfaces/valid-roles';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	signUp(@Body() createUserDto: CreateUserDto) {
		return this.authService.signUp(createUserDto);
	}

	@Get('check-status')
	@Auth()
	checkAuthStatus(@GetUser() user: User) {
		return this.authService.checkAuthStatus(user);
	}

	@Post('login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('private')
	@UseGuards(AuthGuard('jwt'))
	testingPrivateRoute(
		// @Req() req: Request,
		@GetUser() user: User,
		@GetUser('email') userEmail: string,
		@RawHeaders() rawHeaders: string[],
		@Headers() header: IncomingHttpHeaders,
	) {
		return {
			ok: true,
			message: 'This is a private route, only accessible with a valid token',
			user,
			userEmail,
			rawHeaders,
			header,
		};
	}

	@Get('private2')
	@RoleProtected(VALID_ROLES.ADMIN, VALID_ROLES.SUPER_USER)
	@UseGuards(AuthGuard(), UserRoleGuard)
	privateRoute2(@GetUser() user: User) {
		return {
			ok: true,
			user,
		};
	}

	@Get('private3')
	@Auth(VALID_ROLES.ADMIN, VALID_ROLES.SUPER_USER)
	privateRoute3(@GetUser() user: User) {
		return {
			ok: true,
			user,
		};
	}
}
