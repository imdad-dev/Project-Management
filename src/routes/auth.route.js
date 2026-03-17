import { Router } from "express"
import {registerUser ,loginUser} from  "../controller/auth.controller.js"
import { userRegisterValidator , userLoginValidator} from "../validators/validator.js"
import{ validate} from "../middlewares/validator.middleware.js"

const router = Router()

router.route("/register").post( userRegisterValidator() , validate ,registerUser);
router.route("/login").post( userLoginValidator(), validate ,loginUser);


export default router;