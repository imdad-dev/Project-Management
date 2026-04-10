import mongoose , { Schema} from "mongoose";
import {availableUserRole , userRoleEnum} from "../utils/constant.js"

const projectMemberSchema = new mongoose.Schema( {

    user: {
        type : Schema.Types.ObjectId ,
        ref :" User" ,
        required : true ,
    } ,

    Project: {
        type : Schema.Types.ObjectId ,
        ref : "Project" ,
        required : true ,
    } ,

    role : {
        type : String ,
        enum : availableUserRole ,
        default : userRoleEnum.MEMBER ,

    }
    
 } , { timestamps : true});

 export const  ProjectMember = mongoose.model("Projectmember" , projectMemberSchema);