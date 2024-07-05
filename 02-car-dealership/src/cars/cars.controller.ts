import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create.car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
	constructor(private readonly carsService: CarsService) {}
	@Get()
	getAllCars() {
		return this.carsService.findAll();
	}

	@Get(':id')
	getCarById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
		console.log({ id });
		const car = this.carsService.findOneById(id);
		return car;
	}

	@Post()
	createCar(@Body() createCarDto: CreateCarDto) {
		const car = this.carsService.create(createCarDto);
		return car;
	}

	@Patch(':id')
	updateCar(@Body() updateCarDto: UpdateCarDto, @Param('id', ParseUUIDPipe) id: string) {
		const car = this.carsService.update(id, updateCarDto);
		return car;
	}

	@Delete(':id')
	deleteCar(@Param('id', ParseUUIDPipe) id: string) {
		const car = this.carsService.delete(id);
		return {
			car,
			message: 'car deleted',
		};
	}
}
