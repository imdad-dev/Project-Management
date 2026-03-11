import mongoose , { Schema} from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new Schema( { 

    avatar : {
        type : {
            url : String ,
            localPath : String ,
        } ,
        default : {
            url : `https://placehold.co/200x250` ,
            localPath : ""
        }
    } ,

    username : {
        type : String ,
        required : true ,
        unique : true ,
        lowercase : true,
        trim : true,
        index : true,
    } ,

    fullName : {
          type : String ,
        required : true ,
        trim : true,
      
    } ,
    email : {
          type : String ,
        required : true ,
        unique : true ,
        lowercase : true,
        trim : true,
       
    } ,
    password : {
          type : String ,
        required : [true , "Password is required"] ,
        unique : true ,
        lowercase : true,
        trim : true,
       
    } ,
    isEmailVerified : {
        type : Boolean ,
      default : false ,
    } , 
    refreshToken : {
        type : String ,
    } ,
    forgotPasswordToken : {
        type : String ,
    } ,
    forgotPasswordExpiry : {
        type : Date,
    } ,
    emailVerificationToken : {
        type : String ,
    } ,
    emailVerificationExpiry : {
        type : Date
    }

} , 
    { 
        timestamps : true ,
    }
)

// hashed password before save database 
userSchema.pre("save" , async function (next){

    if(! this.isModified("password")) return ;
     this.password = await bcrypt.hash(this.password , 10);
     next()
})

// methods-> verify password 

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password , this.password);
}


export const  User = mongoose.model("user" , userSchema);