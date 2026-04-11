import { Router } from "express"
import {registerUser ,
    loginUser ,
    logoutUser ,
    getCurrentUser ,
refreshedAccessToken ,
VerifyEmail ,
resendEmailVerification ,
forgotPasswordRequest ,
resetForgotPassword ,
changeCurrentPassword

} from  "../controller/auth.controller.js"
import { userRegisterValidator , 
    userLoginValidator ,
    userForgotPasswordValidator ,
    userResetForgotPasswordValidator ,
    userChangeCurrentPasswordValidator

} from "../validators/validator.js"
import{ validate} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.mdl.js"

const router = Router()

// unsecure route 
router.route("/register").post( userRegisterValidator() , validate ,registerUser);
router.route("/login").post( userLoginValidator(), validate ,loginUser);
 
 
router.route("/refresh-token").post(refreshedAccessToken);
router.route("/verify-email/:verificationToken").get(VerifyEmail)
 
router.route("/forgot-password").post( userForgotPasswordValidator() , validate , forgotPasswordRequest)
 router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword);


// secure route
router.route("/logout").post(verifyJWT  ,logoutUser);
router.route("/current-user").get(verifyJWT , getCurrentUser);
router.route("/resend-email-verification").post(verifyJWT , resendEmailVerification)
 router.route("/change-password").post(verifyJWT , userChangeCurrentPasswordValidator() , validate, changeCurrentPassword);

export default router;