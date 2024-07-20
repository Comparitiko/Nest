import {
	BadRequestException,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
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

		console.log(file);

		return { filename: file.originalname };
	}
}