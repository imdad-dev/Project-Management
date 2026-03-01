
import express  from "express";
const app = express();

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

export default app;
