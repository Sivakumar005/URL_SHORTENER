import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbconfig.js";
dotenv.config();
connectDB();
const app = express();
app.get('/', (req, res) => {
    res.send("Hello world");
});
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
//# sourceMappingURL=server.js.map