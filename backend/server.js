import express from 'express';
import cors from 'cors'
import authenticationRouter from './src/routers/authentication.router.js';
import expenseRouter from './src/routers/expense.router.js';
import userRouter from './src/routers/user.router.js'
import activityRouter from './src/routers/activity.router.js'
import groupRouter from './src/routers/group.router.js'
import billRouter from './src/routers/bills.router.js'
import oauthRouter from './src/routers/oauth.router.js';
import { connectDB } from "./src/db/index.js";
import dotenv from 'dotenv';
import session from 'express-session';
import os from 'os';
import mongoose from 'mongoose';
import passport from "passport";
import "./src/config/passport.js"; // Ensure this is imported to initialize passport strategies
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        httpOnly: true,
        sameSite:'none' 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT;
app.get("/", (req, res) => res.send("API is running..."));
app.use('/', authenticationRouter);
app.use('/', expenseRouter);
app.use('/', userRouter)
app.use('/', activityRouter)
app.use('/',groupRouter)
app.use('/',billRouter)
app.use('/', oauthRouter);


app.get('/health', async(req, res) => {
    const startDb = Date.now();
    await mongoose.connection.db.admin().ping();
    const dbResponseTime = Date.now() - startDb;

    res.json({
        status: "OK",
        uptime: os.uptime(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        cpuUsage: os.loadavg()[0],
        dbQueryTime: dbResponseTime,
    });
});

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`listening on ${port}`);
        })
    })
    .catch((error) => {
        res.send(error.message);
    })