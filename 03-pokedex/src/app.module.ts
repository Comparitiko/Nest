import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [EnvConfig],
			validationSchema: JoiValidationSchema,
		}),

		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
		}),
		MongooseModule.forRoot(process.env.MONGODB, {
			dbName: 'nest-pokemon',
		}),

		PokemonModule,

		CommonModule,

		SeedModule,
	],
})
export class AppModule {}
