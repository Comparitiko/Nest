import axios from 'axios'
import { Move, PokeAPIResponse } from '../interfaces/pokeapi-response-interface'

export class Pokemon {

	constructor(
		public readonly id: number,
		public name: string,
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
		const { data } = await axios.get<PokeAPIResponse>(`https://pokeapi.co/api/v2/pokemon/${this.id}`)
		return data.moves
	}
}

export const bulbasaur = new Pokemon(1, 'Bulbasaur')
export const charmander = new Pokemon(4, 'Charmander')

console.log(bulbasaur)

bulbasaur.scream()
bulbasaur.speak()
bulbasaur.getMoves()