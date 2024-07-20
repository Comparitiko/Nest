import { v4 as uuid } from 'uuid';

export const fileNamer = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: (err: Error, acceptFile: string) => void,
) => {
	if (!file) return callback(new Error('No file was uploaded.'), null);

	const fileExtension = file.mimetype.split('/')[1];

	const fileName = `${uuid()}.${fileExtension}`;

	return callback(null, fileName);
};
