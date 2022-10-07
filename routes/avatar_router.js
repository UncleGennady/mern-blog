import {Router} from "express";
import upload from "../model/multer.js";
import uploadController from "../controller/upload_controller.js";


const router = new Router();

router.post('/', upload.single('image'), uploadController.uploadImage);
router.delete('/', uploadController.deleteImage);

export default router
