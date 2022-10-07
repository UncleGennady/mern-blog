import {Router} from "express";
import upload from "../model/multer.js";
import uploadController from "../controller/upload_controller.js";
import checkAuth from "../utils/checkAuth.js";


const router = new Router();

router.post('/', checkAuth, upload.single('image'), uploadController.uploadImage);
router.delete('/', uploadController.deleteImage);

export default router
