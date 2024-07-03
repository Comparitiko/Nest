import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
	constructor(private readonly carsService: CarsService) {}
	@Get()
	getAllCars() {
		return this.carsService.findAll();
	}

	@Get(':id')
	getCarById(@Param('id', ParseIntPipe) id: number) {
		console.log({ id });
		const car = this.carsService.findOneById(id);
		return car;
	}

	@Post()
	createCar(@Body() body: any) {
		return body;
	}

	@Patch(':id')
	updateCar(@Body() body: any, @Param('id', ParseIntPipe) id: number) {
		return {
			body,
			id,
		};
	}

	@Delete(':id')
	deleteCar(@Param('id', ParseIntPipe) id: number) {
		return {
			id,
			message: 'car deleted',
		};
	}
}
