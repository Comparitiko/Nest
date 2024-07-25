import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { VALID_ROLES } from 'src/auth/interfaces/valid-roles';

@Controller('seed')
export class SeedController {
	constructor(private readonly seedService: SeedService) {}

	@Get()
	@Auth(VALID_ROLES.ADMIN)
	executeSeed() {
		return this.seedService.runSeed();
	}
}
