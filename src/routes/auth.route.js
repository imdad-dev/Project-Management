import { Router } from "express"
import {registerUser ,
    loginUser ,
    logoutUser ,
    getCurrentUser ,
refreshedAccessToken ,
} from  "../controller/auth.controller.js"
import { userRegisterValidator , userLoginValidator} from "../validators/validator.js"
import{ validate} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.mdl.js"

const router = Router()

router.route("/register").post( userRegisterValidator() , validate ,registerUser);
router.route("/login").post( userLoginValidator(), validate ,loginUser);
router.route("/logout").post(verifyJWT  ,logoutUser);
router.route("/current-user").get(getCurrentUser);
router.route("/refresh-token").post(verifyJWT , refreshedAccessToken);

export default router;