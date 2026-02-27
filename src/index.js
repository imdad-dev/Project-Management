
import express  from "express";

const app = express();
const PORT = 8000;

//middleware 
app.use(express.json());


app.get("/" , async (req , res)=>{
   res.status(200).send("Hello from Server")
})



app.listen(PORT , ()=>{
console.log(`Server is lisnetng at https://localhost:${PORT}`);
})
