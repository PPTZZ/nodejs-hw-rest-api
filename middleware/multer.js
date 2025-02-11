import multer from 'multer';

const sotrage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '../../public/avatars');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${file.fieldname}-${uniqueSuffix}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimeType.startsWith('image')) {
		cb(null, false);
	} else {
		cb(null, true);
	}
};

const upload = multer({ storage: sotrage, fileFilter: fileFilter });

export default upload
