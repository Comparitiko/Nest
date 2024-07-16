import { IsString, IsPositive, Min, MinLength, IsInt } from 'class-validator';

export class CreatePokemonDto {
	// String, Min-length: 1
	@IsString()
	@MinLength(1)
	name: string;
	// Numero, Positivo, Mayor que 1
	@IsInt()
	@IsPositive()
	@Min(1)
	no: number;
}
