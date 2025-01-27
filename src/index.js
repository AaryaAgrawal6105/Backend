<<<<<<< HEAD
//require('dotenv').config({path: "./env"})

import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGODB Connection failed!! ", err); 
})



/*
const app = express()

//IIFE:-
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`your app is listening on http://localhost:${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error: ", error);
        throw error;
=======
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
>>>>>>> 8d51745029c545cbcd2a75d87e50a162d9e435fd
    }
})
*/