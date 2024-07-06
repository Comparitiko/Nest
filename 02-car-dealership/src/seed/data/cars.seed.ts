import { v4 as uuid } from 'uuid';

import { Car } from 'src/cars/interfaces/car.interface';

export const CARS_SEED: Car[] = [
	{
		id: uuid(),
		brand: 'Ford',
		model: 'Mustang',
	},
	{
		id: uuid(),
		brand: 'BMW',
		model: 'X5',
	},
	{
		id: uuid(),
		brand: 'Mercedes',
		model: 'S-Class',
	},
	{
		id: uuid(),
		brand: 'Audi',
		model: 'A8',
	},
	{
		id: uuid(),
		brand: 'Volvo',
		model: 'XC90',
	},
	{
		id: uuid(),
		brand: 'Toyota',
		model: 'Corolla',
	},
	{
		id: uuid(),
		brand: 'Honda',
		model: 'Civic',
	},
	{
		id: uuid(),
		brand: 'Hyundai',
		model: 'Elantra',
	},
];
