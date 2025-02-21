import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsDir = path.join(__dirname, "../../public/avatars");
await fs.mkdir(avatarsDir, { recursive: true });

const processImage = async (sourcePath, destinationPath) => {
  const readStream = fsSync.createReadStream(sourcePath);

  const transformStream = sharp()
    .resize(250, 250, { fit: "inside" })
    .toFormat("jpeg");

  const writeStream = fsSync.createWriteStream(destinationPath);

  await pipeline(readStream, transformStream, writeStream);
};

export const uploadAvatarController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uniqFilename = `${req.user._id}-${Date.now()}.jpg`;
    const destinationPath = path.join(avatarsDir, uniqFilename);

    try {
      await processImage(req.file.path, destinationPath);

      req.user.avatarUrl = `/api/users/avatars/${uniqFilename}`;
      await req.user.save();

      res.status(200).json({ avatarUrl: req.user.avatarUrl });
    } catch (err) {
      res.status(500).json({ error: "Failed to process image" });
    } finally {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Error deleting uploaded file:", err);
      }
    }
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAvatarController = async (req, res) => {
  try {
    const { avatarName } = req.params;
    const filePath = path.join(avatarsDir, avatarName);
    try {
      await fs.access(filePath);
    } catch (err) {
      return res.status(404).json({ error: "Avatar not found" });
    }
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
