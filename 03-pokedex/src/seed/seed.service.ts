import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response-interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
// import { FecthAdapter } from 'src/common/adapters/fetch.adapter';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
	constructor(
		@InjectModel(Pokemon.name)
		private readonly pokemonModel: Model<Pokemon>,
		private readonly http: AxiosAdapter,
	) {}

	async executeSeed() {
		await this.pokemonModel.deleteMany(); // === DELETE * FROM pokemons

		const data = await this.http.get<PokeResponse>(
			'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0',
		);

		const pokemonToInsert: { name: string; no: number }[] = [];

		data.results.forEach(({ name, url }) => {
			const segments = url.split('/');
			const no: number = +segments[segments.length - 2];

			pokemonToInsert.push({ name, no });
		});

		await this.pokemonModel.insertMany(pokemonToInsert); // Solo hace una conexión a la base de datos

		return { message: 'Seed executed' };
	}
}
