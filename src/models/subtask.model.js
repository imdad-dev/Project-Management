import mongoose , { Schema} from "mongoose";


const subtaskSchema = new Schema( {

    title : {
        type : String ,
        required : true ,
        trim : true 
    } ,
    description : {
        type : String 
    } ,
    
    task : {
        type : Schema.Types.ObjectId ,
        ref : "Task" ,
        requied : true
    },

    createdBy : {
            type : Schema.Types.ObjectId ,
        ref : "User" ,
    } ,

    isCompleted : {
        type : Boolean ,
        default : false 
    }
 
 } , { timestamps : true});

 export const  Subtask = mongoose.model("Subtask" , subtaskSchema);