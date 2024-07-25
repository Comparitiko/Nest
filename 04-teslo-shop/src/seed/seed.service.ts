import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
	constructor(
		@Inject()
		private readonly productsService: ProductsService,
	) {}

	async runSeed() {
		const inserted = await this.insertNewProducts();

		if (!inserted) {
			return { message: 'Seed not executed, error inserting new products' };
		}
		return { message: 'Seed executed successfully' };
	}

	private async insertNewProducts() {
		const products = initialData.products;
		try {
			await this.productsService.deleteAllProducts();

			const insertPromises: Promise<any>[] = [];

			products.forEach((product) => {
				insertPromises.push(this.productsService.create(product));
			});

			await Promise.all(insertPromises);

			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
