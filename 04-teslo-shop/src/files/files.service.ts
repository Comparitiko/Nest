import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
	getStaticProductImage(type: string, imageName: string) {
		const path = join(__dirname, '../../static/', type, '/', imageName);

		if (!existsSync(path)) {
			throw new BadRequestException(`Image ${imageName} not found`);
		}

		return path;
	}
}
