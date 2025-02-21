import express, { Router } from "express";
import path from "path";
import {
  createUserController,
  loginUserController,
  getCurrentUserController,
  logOutUserController,
  verifiEmailController,
} from "../../service/controllers/usersController.js";
import {
  getAvatarController,
  uploadAvatarController,
} from "../../service/controllers/fileController.js";
import upload from "../../middleware/multer.js";
import auth from "../../middleware/auth.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersRouter = Router();

usersRouter.post("/signup", createUserController);
usersRouter.get("/verify-email/:jwt", verifiEmailController);
usersRouter.post("/login", loginUserController);
usersRouter.patch("/:userId/logout", auth, logOutUserController);
usersRouter.get("/current", auth, getCurrentUserController);
usersRouter.put(
  "/avatars",
  auth,
  upload.single("avatar"),
  uploadAvatarController
);
usersRouter.get("/avatars/:avatarName", getAvatarController);

usersRouter.use(
  express.static(path.join(__dirname, "../../../public/avatars"))
);

export default usersRouter;
