//require('dotenv').config({path:"/env"})
import express from 'express';
import connectDB from "./db/index.js";
import dotenv from 'dotenv'
import app from './app.js'
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT|| 8000 , ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("error in connecting to db" , err)
})

/*
const app = express();
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error" , (error) =>{
            console.log("Error" , error);
            throw error;
        })
        app.listen(process.env.PORT , ()=>{
            console.log(`Listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error" , error);
        throw error;s
    }
})
*/