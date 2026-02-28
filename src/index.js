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


app.get("/" ,  (req , res)=>{
   res.status(200).send("Hello from Server")
})


app.get("/home" , (req , res)=>{

   res.status(200).send("<p>This is Home Page!</p>");
})

app.get("/task" , (req , res)=>{

   res.status(200).json({ "task1" : "Write here your first Task"})
})


app.get("/facebook" , (req , res)=>{

   res.status(200).redirect("https://facebook.com");
})

app.get("/end" , (req , res)=>{

   res.status(400).end();
})

app.listen(port , ()=>{
console.log(`Server is lisnetng at http://localhost:${port}`);
})
