import {Router} from "express";
import {postCreateValidation} from "../validations/validations.js";
import postController from '../controller/post_controller.js'
import checkAuth from "../utils/checkAuth.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";


const router = new Router();

router.get('/', postController.getAll)
router.get('/tags', postController.getLastTags)
router.get('/:id', postController.get)
router.post('/', checkAuth, postCreateValidation, handleValidationErrors, postController.create)
router.patch('/:id',checkAuth, postCreateValidation, handleValidationErrors, postController.update)
router.delete('/:id',checkAuth, postController.delete)

export default router