import{ User} from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js"
 import {ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js";
import { access } from "fs";
import {emailVerificationMailgenContent, resetPasswordMailgenContent, sendEmail} from "../utils/mail.js"
import { create } from "domain";
import jwt from "jsonwebtoken"

/* -----------Generate Access and RefreshToken separately ---------- */

const generateAccessAndRefreshTokens = async (userId)=>{
 try {
     
     
     const user = await User.findById(userId);
if (!user) {
      throw new ApiError(404, "User not found for token generation");
    }

const accessToken = user.generateAccessToken();
const refreshToken = user.generateRefreshToken();

user.refreshToken = refreshToken ;
await user.save( { validateBeforeSave : false});
return { accessToken , refreshToken};

 } catch (error) {
   throw new ApiError (509 , "AccessToken and Refresh token generate Error" , [])  
 }

}

/**==================Register ====================* */
const registerUser =asyncHandler ( async (req , res)=>{
     const {username , email , password ,fullName , role } = req.body;

     // check user in DB
     const existedUser = await User.findOne ( {
          $or : [ { email } , {username}]
     });

     if(existedUser) {
      throw  new ApiError(409 , "Username or Email  Already exist" , []);
     }

     const user =await  User.create ({
          username , 
          email , 
          password , 
          fullName ,
          role ,
          isEmailVerified : false ,
     })

     // ------------Email confirmation or verify mail --------------//

     /*------------Temporary Token ----------------*/

     const { unHashedToken , hashedToken , tokenExpiry } =  user.generateTemporaryToken();


// Email Verify Token 

user.emailVerificationToken = hashedToken;
user.emailVerificationExpiry =tokenExpiry ;

await user.save( { validateBeforeSave : false});


// finaly Send Email 
let emailVerificationURL = `${req.protocol}://${req.get("host")}/api/v1/verify-email/${unHashedToken}`
 
// console.log ("User: ", user)
// console.log ("EmailVerifyLink--->: ", emailVerificationURL);

await sendEmail ({
     email : user?.email ,
     subject : "Please Verify your email" ,
     mailgenContent : emailVerificationMailgenContent( 
             user.username ,
            emailVerificationURL ,
     )
})

 //Get the created user without sensitive fields
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  
  if(!createdUser){
    throw new ApiError(500 , "Something Went Wrong while registering a user");
  }

  return res
  .status(200)
  .json (
     new ApiResponse (
          200 ,
     {     user : createdUser  } ,
          "Register User Successfuly! verification mail send on your Email "
     )
  )

})


/** ===============LOGIN USER====================**/

const loginUser = asyncHandler ( async (req , res)=>{
     const {email , username ,password } = req.body;
 
     if(!email) {
          throw  new ApiError(400 , 'Email is Required');
     }
     const user = await User.findOne({ email });

     if(!user) {
              throw  new ApiError(404 , 'User does not find');

     }

     const isPasswordValid = user.isPasswordCorrect(password);

     if(!isPasswordValid) {
              throw  new ApiError(400 , 'Invalid credential or password');

     }

    
     // async function , and create token use await 
     const {accessToken , refreshToken } =await generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).select(
          "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
     );

     const option = {
          httpOnly : true,
          secure : true ,
     }

     return res
     .status(200)
     .cookie("accessToken",accessToken , option)
     .cookie("refreshToken" , refreshToken , option)
     .json( 
          new ApiResponse (
               200 , 
               {
                    user : loggedInUser ,
                    accessToken,
                    refreshToken ,
               } ,
               "User Logged in Successfully"

          )
     )
})

const logoutUser = asyncHandler (async (req , res)=>{

     await User.findByIdAndUpdate (
          req.user._id ,
           {
               $set :{
                 refreshToken : "" ,
               }
           } ,
           {
               new : true ,

           }
     )

     const option = {
          httpOnly : true ,
          secure : true ,
     }

     return  res
     .status(200)
     .clearCookie("accessToken" , option)
     .clearCookie("refreshToken" , option)
     .json ( 
          new ApiResponse (
               200 , 
               { } ,
               "User logout successfully"
          )
     )
});


const getCurrentUser = asyncHandler ( async ( req , res)=>{
     
     // req has user access 
     return res
     .status(200)
     .json ( 
          new ApiResponse(
               200 ,
               req.user,
               "Current user fetch successfully"
          )
     )
})


/*===============Refreshed Access Token================= */
const refreshedAccessToken = asyncHandler ( async ( req , res)=>{

     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

     if( !incomingRefreshToken ) {
          throw new ApiError(401 ,"Unauthorized access");
     }

     try {
          const decodedToken =  jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET);

          const user = await User.findById(decodedToken?._id);
      
          if(!user){
                 throw new ApiError(404 ,"Invalid Refresh token (No user)");
          }

          if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401 ,"Refresh token expire");
          }


          const  options = { 
               httpOnly : true ,
               secure : true ,
          }

          const { accessToken , refreshToken : newRefreshToken } = await generateAccessAndRefreshTokens(user?._id);

          user.refreshToken = newRefreshToken;
         await user.save();

          // return access token :access token refreshed
          return res
          .status(200)
          .cookie("accessToken" , accessToken , option)
          .cookie("refreshToken" , refreshToken, option)
          .json(
               new ApiResponse(
                    200 , 

                    {
                         accessToken ,
                         refreshToken : newRefreshToken ,
                    } ,

                    " Access Token refreshed" 
               )
          )
          
     } catch (error) {
           throw new ApiError( 401 ,"Invalid Refresh token");    
     }
})

/* ===============Email Verification==================== */

const VerifyEmail = asyncHandler ( async ( req , res)=>{
const { verificationToken } = req.params;

if(!verificationToken){
     throw new ApiError(401 , "Verification Token is missing ");
}

let hashedToken = crypto
.createHash("sha256")
.update(verificationToken)
.digest("hex")

const user = await User.findOne({
     emailVerificationToken : hashedToken ,
     emailVerificationExpiry : { $gt : Date.now() }
});

if(!user){
     throw new ApiError(401 , "Verification Token is missing or expired.");
}

user.emailVerificationToken =undefined;
user.emailVerificationExpiry =undefined;  
user.isEmailVerified = true;

await user.save({ validateBeforeSave : false});

return res
.status(200)
.json(
     200,
     { isEmailVerified : true } ,
     "Email is verified" 
)
})

/*===============Resend Email Verification================= */
const resendEmailVerification = asyncHandler ( async ( req , res)=>{

     const user = await User.findById(req.user?._id);
     
     if(!user){
          throw new ApiError(404 ,"User does not exist");
     }

     if(!user.isEmailVerified){
          throw new ApiError(409 ,"Email have already verified");
     }

       const { unHashedToken , hashedToken , tokenExpiry } =  user.generateTemporaryToken();


// Email Verify Token 

user.emailVerificationToken = hashedToken;
user.emailVerificationExpiry =tokenExpiry ;

await user.save( { validateBeforeSave : false});

let emailVerificationURL = `${req.protocol}://${req.get("host")}/api/v1/verify-email/${unHashedToken}`;
await sendEmail ({
     email : user?.email ,
     subject : "Please Verify your email" ,
     mailgenContent : emailVerificationMailgenContent( 
             user.username ,
            emailVerificationURL ,
     )
})

return res
.status(200)
.json(
   new ApiResponse (
     200 ,
     {} ,
     "Mail has been sent to your email ID")
   )
})

/*===================Forgot Password ================= */

const forgotPasswordRequest =   asyncHandler( async (req , res)=>{

     const { email } = req.body;
const user = await User.findOne({ email });
if(!user){
     throw new ApiError (404, "user does not exist");
}


       const { unHashedToken , hashedToken , tokenExpiry } =  user.generateTemporaryToken();

user.forgotPasswordToken = hashedToken;
user.forgotPasswordExpiry =tokenExpiry ;

await user.save( { validateBeforeSave : false});

let forgotPasswordRedirectURL = `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`;
await sendEmail ({
     email : user?.email ,
     subject : "Password reset request" ,
     mailgenContent : resetPasswordMailgenContent( 
             user.username ,
            forgotPasswordRedirectURL ,
     )
})
})
/*==============Reset Forgot password================= */
const resetForgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, "Token is invalid or expired");
  }

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});


/*=============Change password=================== */
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});



export { 
      registerUser ,
      loginUser ,
      logoutUser ,
      getCurrentUser ,
      refreshedAccessToken ,
      VerifyEmail ,
      resendEmailVerification ,
      forgotPasswordRequest ,
      resetForgotPassword ,
      changeCurrentPassword 
  
}