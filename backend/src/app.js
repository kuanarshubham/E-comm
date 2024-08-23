import express, {urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//pre-settings
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(urlencoded({
    extended:true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());



//routers
import userRouter from "./routes/user.router.js";

app.use("/api/v1/user", userRouter);


export default app;