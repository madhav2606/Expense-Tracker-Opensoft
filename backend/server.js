import express from 'express';
import cors from 'cors'
import authenticationRouter from './src/routers/authentication.router.js'
import { connectDB } from "./src/db/index.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

app.get("/", (req, res) => res.send("Hello"));



const port = process.env.PORT;
app.use('/', authenticationRouter);


connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`listening on ${port}`);
    })
})
.catch((error)=>{
    res.send(error.message);
})


    