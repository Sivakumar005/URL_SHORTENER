import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import connectDB from "./config/dbconfig.js";
import shortUrl from "./routes/shortUrl.js"

dotenv.config();
connectDB();

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://claude.ai"],
    credentials: true,
}))

app.use("/api",shortUrl);

app.get('/',(req,res)=>{
    res.send("Hello world");
})

const port=process.env.PORT||5001;

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})