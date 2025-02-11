import path from 'path';
import fs from 'fs';
import { Jimp } from 'jimp';

export const uploadAvatarController = async (req, res) => {
	try {
		const image = await Jimp.read(req.file.path);
		await image.resize(250, 250).writeAsync(req.file.path);

		const uniqFilename = `${req.user._id}-${Date.now()}${path.extname(
			req.file.originalname
		)}`;

		const destinationPath = path.join(
			__dirname,
			`./public/avatars/${uniqFilename}`
		);
		fs.renameSync(req.file.path, destinationPath);
		req.user.avatarUrl = `/avatars/${uniqFilename}`;
		await req.user.save();
		res.status(200).json({ avatarUrl: req.user.avatarUrl });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
