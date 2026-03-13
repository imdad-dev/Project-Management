
import express  from "express";
import cors from "cors"
import healthCheckRoute from "./routes/healthCheck.route.js"


const app = express();

//basic configurations ---> middleware 
app.use(express.json( { limit : "16kb"}));
app.use(express.urlencoded({ extended : true} , { limit : "16kb"}));
app.use(express.static("public"));


// cors configurations 
app.use(cors({
   origin : process.env.CROS_ORIGIN?.split(",") || "http://localhost:5173" ,
   credentials : true ,
   methods : ["GET" , "POST" , "PUT" , "PATCH" , "DELETE"  ,"OPTIONS"] ,
   allowedHeaders : ["Authorization" ,"Content-Type"] ,
}))

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


//healthCheck route 
app.use("/api/v1/healthcheck" , healthCheckRoute);

export default app;
