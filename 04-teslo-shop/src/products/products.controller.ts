import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { VALID_ROLES } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Auth()
	@Post()
	create(@GetUser() user: User, @Body() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto, user);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.productsService.findAll(paginationDto);
	}

	@Get(':searchParam')
	findOne(@Param('searchParam') searchParam: string) {
		return this.productsService.findOnePlain(searchParam);
	}

	@Auth(VALID_ROLES.ADMIN)
	@Patch(':id')
	update(
		@GetUser() user: User,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsService.update(id, updateProductDto, user);
	}

	@Auth(VALID_ROLES.ADMIN)
	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.productsService.remove(id);
	}
}
