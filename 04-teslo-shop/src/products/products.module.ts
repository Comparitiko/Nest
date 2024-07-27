import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage } from './entities';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([Product, ProductImage]),
		AuthModule,
	],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
