import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
	constructor(
		@InjectModel(Pokemon.name)
		private readonly pokemonModel: Model<Pokemon>,
	) {}

	async create(createPokemonDto: CreatePokemonDto) {
		createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
		try {
			const pokemon = await this.pokemonModel.create(createPokemonDto);
			return pokemon;
		} catch (error) {
			this.handleException(error);
		}
	}

	async findAll() {
		const pokemons = await this.pokemonModel.find();
		return pokemons;
	}

	async findOne(searchParam: string) {
		let pokemon: Pokemon;

		if (!isNaN(+searchParam)) {
			pokemon = await this.pokemonModel.findOne({ no: searchParam });
		} else if (isValidObjectId(searchParam)) {
			pokemon = await this.pokemonModel.findById(searchParam);
		} else {
			pokemon = await this.pokemonModel.findOne({
				name: searchParam.toLowerCase(),
			});
		}

		// If not found, throw not found exception
		if (!pokemon) {
			throw new NotFoundException(
				`Pokemon with id, name or no ${searchParam} not found`,
			);
		}
		return pokemon;
	}

	async update(searchParam: string, updatePokemonDto: UpdatePokemonDto) {
		const pokemon = await this.findOne(searchParam);
		if (updatePokemonDto.name) {
			updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
		}

		try {
			await pokemon.updateOne(updatePokemonDto);
			return { ...pokemon.toJSON(), ...updatePokemonDto };
		} catch (error) {
			this.handleException(error);
		}
	}

	async remove(id: string) {
		const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

		if (deletedCount === 0) {
			throw new NotFoundException(`Pokemon with id ${id} not found`);
		}

		return;
	}

	private handleException(error: any) {
		console.log(error);
		if (error.code === 11000) {
			throw new BadRequestException(
				`Pokemon ${JSON.stringify(error.keyValue)} already exists`,
			);
		}
		throw new InternalServerErrorException('Could not update pokemon');
	}
}
