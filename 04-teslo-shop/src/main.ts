import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Usar el prefijo de la api como /api
	app.setGlobalPrefix('api');

	// Usar de forma global una pipe de validacion
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true, // Permitir solo las propiedades en la API, si envia otra propiedad, se rechaza con un error 400
		}),
	);

	await app.listen(3000);
}
bootstrap();
