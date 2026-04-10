import mongoose , { Schema} from "mongoose";


const projectNoteSchema= new Schema( {

    content : {
        type : String ,
        required : true ,
       
    } ,
  
    project : {
        type : Schema.Types.ObjectId ,
        ref : "Project" ,
        requied : true
    },

    createdBy : {
            type : Schema.Types.ObjectId ,
           ref : "User" ,
           required : true
    } ,


 } , { timestamps : true});

 export const  ProjectNote = mongoose.model("ProjectNote" , projectNoteSchema);