import { Injectable } from '@nestjs/common';
import { BrandsService } from 'src/brands/brands.service';
import { CarsService } from 'src/cars/cars.service';
import { BRANDS_SEED } from './data/brands.seed';
import { CARS_SEED } from './data/cars.seed';

@Injectable()
export class SeedService {
	constructor(
		private readonly brandsService: BrandsService,
		private readonly carsService: CarsService,
	) {}

	populateDatabase() {
		this.brandsService.fillBrandsWithSeed(BRANDS_SEED);
		this.carsService.fillCarsWithSeed(CARS_SEED);
		return {
			message: 'Database seeded',
		};
	}
}
