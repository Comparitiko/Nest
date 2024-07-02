import { Move, PokeAPIResponse } from '../interfaces/pokeapi-response-interface'
import { HttpAdapter, PokeApiAdapter, PokeApiFetchAdapter } from '../api/pokeApi.adapter'

export class Pokemon {

	constructor(
		public readonly id: number,
		public name: string,
		// Inyectar dependencias
		private readonly http: HttpAdapter
	) {}

	// Get the image URL for the Pokemon
	public get imageUrl(): string {
		return `https://pokemon.com/${this.id}.png`
	}

	// Pokemon scream
	public scream() {
		console.log(`😱 ${this.name} is screaming!`)
	}

	// Pokemon speak
	public speak() {
		console.log(`👋 ${this.name} is speaking!`)
	}

	async getMoves(): Promise<Move[]> {
		const data = await this.http.get<PokeAPIResponse>(`https://pokeapi.co/api/v2/pokemon/${this.id}`)
		return data.moves
	}
}

const pokeApiAxios = new PokeApiAdapter()
const pokeApiFetch = new PokeApiFetchAdapter()

export const bulbasaur = new Pokemon(1, 'Bulbasaur', pokeApiAxios)
export const charmander = new Pokemon(4, 'Charmander', pokeApiFetch)

console.log(await bulbasaur.getMoves())
console.log(await charmander.getMoves())