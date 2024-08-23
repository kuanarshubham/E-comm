import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const db = async () => {
    try{
        const instance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Instance connected: ", instance.connection.host);
    }
    catch(err){
        console.log(err.message);
        
    }
}