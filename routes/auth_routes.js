import {Router} from "express";
import{registerValidation, loginValidation} from "../validations/validations.js";
import checkAuth from "../utils/checkAuth.js";
import authController from '../controller/auth_controller.js'
import handleValidationErrors from "../utils/handleValidationErrors.js";

const router = new Router()

router.post('/login', loginValidation, handleValidationErrors, authController.login )

router.post('/register', registerValidation, handleValidationErrors, authController.register)

router.get('/me', checkAuth, authController.getMe)
export default router