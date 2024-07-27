import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly configService: ConfigService,
	) {}

	@Post('products')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: fileFilter,
			// limits: { fileSize: 1024 * 1024 * 10 },
			storage: diskStorage({
				destination: './static/products',
				filename: fileNamer,
			}),
		}),
	)
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		if (!file)
			throw new BadRequestException('Make sure that file is a valid image');

		const secureUrl = `${this.configService.get('HOST_API')}/files/products/${file.filename}`;

		return { secureUrl };
	}

	@Get(':type/:imageName')
	findProductImage(
		@Res() res: Response,
		@Param('type') type: string,
		@Param('imageName') imageName: string,
	) {
		const path = this.filesService.getStaticProductImage(type, imageName); // Esto es recomendable que venga de un bucket en vez de estar fisicamente en el backend

		res.sendFile(path);
	}
}
