import mongoose , { Schema} from "mongoose";
import {availableTaskStatus , taskStatusEnum} from "../utils/constant.js"

const taskSchema = new Schema( {

    title : {
        type : String ,
        required : true ,
        trim : true 
    } ,
    description : {
        type : String 
    } ,
    
    project : {
        type : Schema.Types.ObjectId ,
        ref : "Project" ,
        requied : true
    },

    assignedTo : {
            type : Schema.Types.ObjectId ,
        ref : "User" ,
    } ,
    assignedby : {
            type : Schema.Types.ObjectId ,
           ref : "User" ,
    } ,

 status : {
    type : String,
    enum : availableTaskStatus ,
    default : taskStatusEnum.TODO,
 },

 attacement:{
    type : [{
        url : String ,
        mimetype : String,
        size : Number ,
    }],
    default : [],
 }
   
    
 } , { timestamps : true});

 export const  Task = mongoose.model("Task" , taskSchema);