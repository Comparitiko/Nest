import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Product, ProductImage } from './entities';

import { validate as isUUID } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger('ProductsService');
	private readonly API_HOST = this.configService.get('HOST_API');

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		@InjectRepository(ProductImage)
		private readonly productImageRepository: Repository<ProductImage>,

		private readonly dataSource: DataSource,

		private readonly configService: ConfigService,
	) {}

	async create(createProductDto: CreateProductDto) {
		const { images = [], ...productDetails } = createProductDto;

		try {
			const product = this.productRepository.create({
				...productDetails,
				images: images.map((image) => {
					return this.productImageRepository.create({ url: image });
				}),
			});

			await this.productRepository.save(product);

			return { ...product, images: images };
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit = 10, offset = 0 } = paginationDto;

		const products = await this.productRepository.find({
			take: limit,
			skip: offset,
			relations: {
				images: true,
			},
		});

		return products.map((product) => {
			return {
				...product,
				images: product.images.map(
					(image) => `${this.API_HOST}/files/products/${image.url}`,
				),
			};
		});
	}

	private async findOne(searchParam: string) {
		const queryBuilder = this.productRepository.createQueryBuilder('prod');
		let product: Product;
		if (isUUID(searchParam)) {
			product = await this.productRepository.findOneBy({ id: searchParam });
		} else {
			product = await queryBuilder
				.where('LOWER(title) = :title OR slug = :slug', {
					title: searchParam.toLowerCase(),
					slug: searchParam.toLowerCase(),
				}) // Previene SQL injection
				.leftJoinAndSelect('prod.images', 'prodImages')
				.getOne();
		}

		if (!product) {
			throw new NotFoundException(`Product with id ${searchParam} not found`);
		}

		return product;
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		const { images, ...toUpdate } = updateProductDto;

		const product = await this.productRepository.preload({
			id,
			...toUpdate,
		});

		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}

		// Create query runner
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			if (images) {
				await queryRunner.manager.delete(ProductImage, { product: { id } });

				product.images = images.map((image) =>
					this.productImageRepository.create({ url: image }),
				);
			}

			// await this.productRepository.save( product );
			await queryRunner.manager.save(product);

			await queryRunner.commitTransaction();

			return this.findOnePlain(id);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.handleDBExceptions(error);
		} finally {
			await queryRunner.release();
		}
	}

	/**
	 * Remove a product from the database
	 * @param id - Product id
	 * @returns Product
	 */
	async remove(id: string) {
		const product = await this.findOne(id);

		await this.productRepository.delete({ id });
		return {
			...product,
			images: product.images.map((image) => image.url),
		};
	}

	async findOnePlain(searchParam: string) {
		const product = await this.findOne(searchParam);

		return {
			...product,
			images: product.images.map(
				(image) => `${this.API_HOST}/files/products/${image.url}`,
			),
		};
	}

	private handleDBExceptions(error: any) {
		if (error.code === '23505') {
			throw new BadRequestException(error.detail);
		}
		this.logger.error(error);
		throw new InternalServerErrorException('Unexpected error, check the logs');
	}

	async deleteAllProducts() {
		if (process.env.NODE_ENV === 'production') {
			throw new BadRequestException('This action is not allowed in production');
		}

		const query = this.productRepository.createQueryBuilder('product');

		try {
			return await query.delete().where({}).execute();
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}
}
