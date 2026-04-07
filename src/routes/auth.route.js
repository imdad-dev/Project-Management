import { Router } from "express"
import {registerUser ,
    loginUser ,
    logoutUser ,
    getCurrentUser ,
refreshedAccessToken ,
VerifyEmail ,
resendEmailVerification ,
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
router.route("/verify-email/:verificationToken").get(VerifyEmail)
router.route("/resend-email-verification").post(resendEmailVerification)

export default router;