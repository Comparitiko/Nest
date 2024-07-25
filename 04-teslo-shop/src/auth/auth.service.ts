import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async signUp(createUserDto: CreateUserDto) {
		const { password, ...userData } = createUserDto;

		const SALT_ROUNDS = parseInt(this.configService.get<string>('SALT_ROUNDS'));

		const hashedPassword = hashSync(password, SALT_ROUNDS);

		try {
			const user = this.userRepository.create({
				...userData,
				password: hashedPassword,
			});

			await this.userRepository.save(user);

			delete user.password;

			return {
				...user,
				token: this.getJwtToken({ id: user.id }),
			};

			// TODO: Return JWT
		} catch (error) {
			this.handleDBException(error);
		}
	}

	async login(loginUserDto: LoginUserDto) {
		const { email, password } = loginUserDto;

		const userDB = await this.userRepository.findOne({
			where: { email },
			select: { email: true, password: true, id: true },
		});

		if (!userDB) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const isPasswordCorrect = compareSync(password, userDB.password);

		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Invalid email or password');
		}

		delete userDB.password;

		const { id, ...userDbData } = userDB;

		return {
			...userDbData,
			token: this.getJwtToken({ id }),
		};
	}

	private getJwtToken(payload: JwtPayload) {
		const token = this.jwtService.sign(payload); // Genera el token
		return token;
	}

	private handleDBException(error: any): void {
		if (error.code === '23505') {
			throw new BadRequestException(error.detail);
		}

		console.log(error);
		throw new InternalServerErrorException('Please check server logs');
	}
}
