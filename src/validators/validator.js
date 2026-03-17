import { body } from "express-validator"

const userRegisterValidator = () =>{
    return  [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email") ,

        body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLowercase()
        .withMessage("Username must be lower case ")
        .isLength( { min: 5})
        .withMessage("username atleas more than 5 character") ,

        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required") ,

        body("fullName")
        .optional()
        .trim()
    ]
}

const userLoginValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Invalid email") ,

        body("password")
        .notEmpty()
        .withMessage("password is required")
        
    ]
}

export {
    userRegisterValidator ,
    userLoginValidator
}