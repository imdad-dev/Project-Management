import { validationResult } from "express-validator";
import {ApiError } from "../utils/api-error.js";


export const validate = (req , res , next)=>{
    const result = validationResult(req);

    if(result.isEmpty()){
        return next() ; 
    }

    const extractedError = [];
    result.array().map( (err)=>extractedError.push({
        [err.path] : err.msg
    }))

    throw new ApiError(422 , "Recived data is not valide" , extractedError)

}