import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
	private brands: Brand[] = [
		// {
		// 	id: uuid(),
		// 	name: 'Toyota',
		// 	createdAt: new Date().getTime(),
		// 	updatedAt: null,
		// },
	];

	create(createBrandDto: CreateBrandDto) {
		const { name } = createBrandDto;
		const brand: Brand = {
			id: uuid(),
			name: name.toLowerCase(),
			createdAt: new Date().getTime(),
		};
		this.brands.push(brand);
		return brand;
	}

	findAll() {
		return this.brands;
	}

	findOne(id: string) {
		const brand = this.brands.find((brand) => brand.id === id);
		if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
		return brand;
	}

	update(id: string, updateBrandDto: UpdateBrandDto) {
		const brandDB = this.findOne(id);

		if (brandDB.name === updateBrandDto.name) throw new BadRequestException('Name already exists');

		const updatedBrand = {
			...brandDB,
			name: updateBrandDto.name.toLowerCase(),
			updatedAt: new Date().getTime(),
		};

		this.brands = this.brands.map((brand) => {
			if (brand.id === id) {
				return updatedBrand;
			}
			return brand;
		});

		return updatedBrand;
	}

	remove(id: string) {
		const brand = this.findOne(id);
		this.brands = this.brands.filter((brand) => brand.id !== id);
		return {
			...brand,
			message: `Brand with id ${id} removed`,
		};
	}

	fillBrandsWithSeed(brands: Brand[]) {
		this.brands = brands;
	}
}
