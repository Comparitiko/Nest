import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			database: process.env.POSTGRES_DB,
			port: +process.env.DB_PORT,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			autoLoadEntities: true,
			synchronize: true,
		}),
		ProductsModule,
		CommonModule,
	],
})
export class AppModule {}
