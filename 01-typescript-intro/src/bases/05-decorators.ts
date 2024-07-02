class newPokemon {
	constructor(
		public readonly id: number,
		public name: string,
	) {}

	scream() {
		console.log(`😱 BUUUUUUU`)
	}

	speak() {
		console.log(`👋 Siempre saludaba!!`)
	}
}


const MyDecorator = () => {
	return (_target: Function) => {
		// console.log(target)
		return newPokemon
	}
}


@MyDecorator()
export class Pokemon {
	constructor(
		public readonly id: number,
		public name: string,
	) {}

	scream() {
		console.log(`😱 ${this.name.toUpperCase()} is screaming!`)
	}

	speak() {
		console.log(`👋 ${this.name}, ${this.name}!`)
	}
}

export const charmander = new Pokemon(4, 'Charmander')

charmander.scream()
charmander.speak()