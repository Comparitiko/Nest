import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const logger = new Logger('Main');

	// Usar el prefijo de la api como /api
	app.setGlobalPrefix('api');

	app.disable('x-powered-by');

	// Usar de forma global una pipe de validacion
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true, // Permitir solo las propiedades en la API, si envia otra propiedad, se rechaza con un error 400
		}),
	);

	const PORT = +process.env.PORT;

	if (!PORT || isNaN(PORT)) {
		throw new Error('Define the PORT environment variable');
	}

	// Configurar la documentacion de swagger
	const config = new DocumentBuilder()
		.setTitle('TesloShop API')
		.setDescription('TesloShop endpoints')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(PORT);
	logger.log(`Server running on port ${PORT}`);
}
bootstrap();
