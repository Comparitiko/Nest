import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed.data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
	constructor(
		@Inject()
		private readonly productsService: ProductsService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@Inject()
		private readonly configService: ConfigService,
	) {}

	async runSeed() {
		await this.deleteTables();
		const firstUser = await this.insertUsers();
		const inserted = await this.insertNewProducts(firstUser);

		if (!inserted) {
			return { message: 'Seed not executed, error inserting new products' };
		}
		return { message: 'Seed executed successfully' };
	}

	private async deleteTables() {
		await this.productsService.deleteAllProducts();
		const queryBuilder = this.userRepository.createQueryBuilder();
		await queryBuilder.delete().execute();
	}

	private async insertUsers() {
		const seedUsers = initialData.users;

		const users: User[] = [];

		const SALT_ROUNDS = +this.configService.get<string>('SALT_ROUNDS');

		seedUsers.forEach((seedUser) => {
			seedUser.password = hashSync(seedUser.password, SALT_ROUNDS);
			users.push(this.userRepository.create(seedUser));
		});

		await this.userRepository.save(users);

		return users[0];
	}

	private async insertNewProducts(user: User) {
		const products = initialData.products;
		try {
			await this.productsService.deleteAllProducts();

			const insertPromises: Promise<any>[] = [];

			products.forEach((product) => {
				insertPromises.push(this.productsService.create(product, user));
			});

			await Promise.all(insertPromises);

			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
