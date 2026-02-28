import dotenv from "dotenv"
import express  from "express";

// dotenv configuration 
dotenv.config({
   path : "./.env"  ,
})


const app = express();
const port = process.env.PORT || 3000;

console.log(port)


let myUserName = process.env.name ;
console.log("Username : " , myUserName);


//middleware 
app.use(express.json());


app.get("/" , async (req , res)=>{
   res.status(200).send("Hello from Server")
})



app.listen(port , ()=>{
console.log(`Server is lisnetng at http://localhost:${port}`);
})
