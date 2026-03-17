import{ User} from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js"
 import {ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js";
import { access } from "fs";
import {emailVerificationMailgenContent, sendEmail} from "../utils/mail.js"
import { create } from "domain";

/* -----------Generate Access and RefreshToken separately ---------- */

const generateAccessAndRefreshTokens = async (userId)=>{
 try {
     
     
     const user = await user.findOne(userId);

const accessToken = user.generateAccessToken();
const refreshToken = user.generateRefreshToken();

user.accessToken = accessToken;
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

     // ------------Email confirmation or verify --------------//

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

     const {accessToken , refreshToken } = generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).select(
          "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
     );

     const option = {
          httpOnly : true,
          secure : true ,
     }

     return res
     .status(200)
     .cookie("accessToken" , accessToken , option)
     .cookie("refreshToken" , refreshToken, option)
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

export { 
      registerUser ,
      loginUser
}