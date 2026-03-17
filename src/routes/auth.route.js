import { Router } from "express"
import {registerUser ,loginUser} from  "../controller/auth.controller.js"
import { userRegisterValidator } from "../validators/auth.js"
import{ validate} from "../middlewares/validator.middleware.js"

const router = Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);


export default router;