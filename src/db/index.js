import mongoose from "mongoose";
import { DB_NAME } from "../constansts.js";
async function connectDB(){
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!!! , ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDb connection error" , error);
        process.exit(1);
        throw error;

    }
}
export default connectDB;