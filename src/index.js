import dotenv from "dotenv"

import app from "./app.js"
import connectMongo from "./DB/connectDb.js";

// dotenv configuration 
dotenv.config({
   path : "./.env" ,
})

const port = process.env.PORT || 3000;

connectMongo()
.then( ()=>{
       app.listen(port , ()=>{
console.log(`Server is lisnetng at http://localhost:${port}`);
})
})
.catch ( (err)=>{
    console.log("503 -MongoDb connection Error" , err);
    process.exit(1);
}) 
 