import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSChema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [PokemonController],
	providers: [PokemonService],
	imports: [
		MongooseModule.forFeature([
			{
				name: Pokemon.name,
				schema: PokemonSChema,
			},
		]),
		ConfigModule,
	],
	exports: [MongooseModule],
})
export class PokemonModule {}
