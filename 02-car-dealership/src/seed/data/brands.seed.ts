import { v4 as uuid } from 'uuid';

import { Brand } from 'src/brands/entities/brand.entity';

export const BRANDS_SEED: Brand[] = [
	{
		id: uuid(),
		name: 'Toyota',
		createdAt: new Date().getTime(),
		updatedAt: null,
	},
	{
		id: uuid(),
		name: 'Honda',
		createdAt: new Date().getTime(),
		updatedAt: null,
	},
	{
		id: uuid(),
		name: 'Ford',
		createdAt: new Date().getTime(),
		updatedAt: null,
	},
	{
		id: uuid(),
		name: 'BMW',
		createdAt: new Date().getTime(),
		updatedAt: null,
	},
	{
		id: uuid(),
		name: 'Audi',
		createdAt: new Date().getTime(),
		updatedAt: null,
	},
	{
		id: uuid(),
		name: 'Volvo',
		createdAt: new Date().getTime(),
		updatedAt: null,
	},
];
