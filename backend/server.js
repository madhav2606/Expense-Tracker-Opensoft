import express from 'express';
import cors from 'cors'
import authenticationRouter from './src/routers/authentication.router.js';
import expenseRouter from './src/routers/expense.router.js';
import userRouter from './src/routers/user.router.js'
import activityRouter from './src/routers/activity.router.js'
import { connectDB } from "./src/db/index.js";
import dotenv from 'dotenv';
import session from 'express-session';
dotenv.config();

const app = express();

app.use(express.json()); 
// app.use(express.urlencoded({ extended: true })); 
app.use(cors());

app.get("/", (req, res) => res.send("Hello"));

app.use(session({
    secret: 'yourSecretKey', 
    resave: false,           
    saveUninitialized: true, 
    cookie: { secure: false } 
  }));

const port = process.env.PORT;
app.use('/', authenticationRouter);
app.use('/', expenseRouter);
app.use('/',userRouter)
app.use('/',activityRouter)

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`listening on ${port}`);
    })
})
.catch((error)=>{
    res.send(error.message);
})