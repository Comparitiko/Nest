export const pokemonIds = [1, 2, 30, 50]

pokemonIds.push(+'1')

console.log(pokemonIds) // [1, 2, 30, 50, 100]

interface Pokemon {
	id: number
	name: string
	level?: number
}

export const bulbasaur: Pokemon = {
	id: 1,
	name: 'Bulbasaur',
}

export const charmander: Pokemon = {
	id: 2,
	name: 'Charmander',
}

export const pokemons: Pokemon[] = [
	bulbasaur,
	{
		id: 2,
		name: 'Ivysaur',
		level: 21,
	},
	{
		id: 30,
		name: 'Venusaur',
	},
	charmander
]

console.log(pokemons)