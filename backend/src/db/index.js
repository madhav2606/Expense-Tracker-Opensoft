import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const mongoDBURL = process.env.mongoDBURL;

const connectDB = async()=>{
    try {
        await mongoose
        .connect(mongoDBURL)
        ("connected to database of MongoDB")
        
    } catch (error) {
        console.log({message :error.message})
    }
}

    export {connectDB};