import {Router} from "express";
import checkPost from "../utils/checkPost.js";
import checkAuth from "../utils/checkAuth.js";
import commentController from "../controller/comment_controller.js";
import{commentCreateValidation} from "../validations/validations.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";

const router = new Router
router.get('/:id', commentController.getCommentsPost);
router.get('/', commentController.getLastComments);
router.post('/',checkAuth, checkPost, commentCreateValidation, handleValidationErrors, commentController.create);
router.delete('/:id',checkAuth, commentController.delete);


export default router