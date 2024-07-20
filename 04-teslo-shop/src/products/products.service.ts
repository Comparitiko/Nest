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
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger('ProductsService');

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
	) {}

	async create(createProductDto: CreateProductDto) {
		try {
			const product = this.productRepository.create(createProductDto);
			await this.productRepository.save(product);

			return product;
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	// TODO: Implement pagination
	async findAll(paginationDto: PaginationDto) {
		const { limit = 10, offset = 0 } = paginationDto;
		return await this.productRepository.find({
			take: limit,
			skip: offset,
			// TODO: Relations
		});
	}

	async findOne(searchParam: string) {
		let product: Product;

		if (isUUID(searchParam)) {
			product = await this.productRepository.findOneBy({ id: searchParam });
		} else {
			const queryBuilder = this.productRepository.createQueryBuilder();
			product = await queryBuilder
				.where('LOWER(title) = :title OR slug = :slug', {
					title: searchParam.toLowerCase(),
					slug: searchParam.toLowerCase(),
				}) // Previene SQL injection
				.getOne();
			// SELECT * FROM products WHERE title LIKE '%searchParam% OR slug LIKE '%searchParam%';
			// product = await this.productRepository.findOneBy({ slug: searchParam });
			// const product = await this.productRepository.findOne({ where: { slug: searchParam } }); // Other way to find by slug
		}

		if (!product) {
			throw new NotFoundException(`Product with id ${searchParam} not found`);
		}

		return product;
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		const product = await this.productRepository.preload({
			id: id,
			...updateProductDto,
		});

		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}

		try {
			await this.productRepository.save(product);
			return product;
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async remove(id: string) {
		const product = await this.findOne(id);

		await this.productRepository.delete({ id });
		return product;
	}

	private handleDBExceptions(error: any) {
		if (error.code === '23505') {
			throw new BadRequestException(error.detail);
		}
		this.logger.error(error);
		throw new InternalServerErrorException('Unexpected error, check the logs');
	}
}
