import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CarsService {
	private cars = [
		{
			id: 1,
			brand: 'Ford',
			model: 'Mustang',
		},
		{
			id: 2,
			brand: 'BMW',
			model: 'X5',
		},
		{
			id: 3,
			brand: 'Mercedes',
			model: 'S-Class',
		},
		{
			id: 4,
			brand: 'Audi',
			model: 'A8',
		},
		{
			id: 5,
			brand: 'Volvo',
			model: 'XC90',
		},
	];

	findAll() {
		return this.cars;
	}

	findOneById(id: number) {
		const car = this.cars.find((car) => car.id === id);

		if (!car) throw new NotFoundException(`Car with id '${id}' not found`);

		return car;
	}
}
