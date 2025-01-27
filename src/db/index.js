import mongoose from "mongoose";
<<<<<<< HEAD
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMONGODB Connected Successfully !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("Error: ", error);
        process.exit(1)
    }
}

=======
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
>>>>>>> 8d51745029c545cbcd2a75d87e50a162d9e435fd
export default connectDB;