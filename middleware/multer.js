import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../public/avatars'));
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(
			null,
			`${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
		);
	},
});

const fileFilter = (req, file, cb) => {
	console.log(file.mimetype);
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed!'), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
