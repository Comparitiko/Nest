export const fileFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: (err: Error, acceptFile: boolean) => void,
) => {
	if (!file) return callback(new Error('No file was uploaded.'), false);

	if (!file.mimetype)
		return callback(new Error('No file type was detected.'), false);

	const fileExtension = file.mimetype.split('/')[1];

	const validExtensions = ['png', 'jpeg', 'gif', 'jpg'];

	if (validExtensions.includes(fileExtension)) {
		return callback(null, true);
	}

	callback(null, false);
};
