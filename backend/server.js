import express from 'express';
import cors from 'cors'
import authenticationRouter from './src/routers/authentication.router.js';
import expenseRouter from './src/routers/expense.router.js';
import userRouter from './src/routers/user.router.js'
import activityRouter from './src/routers/activity.router.js'
import { connectDB } from "./src/db/index.js";
import dotenv from 'dotenv';
import session from 'express-session';
import os from 'os';
import mongoose from 'mongoose';
dotenv.config();

const app = express();

app.use(express.json());
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
app.use('/', userRouter)
app.use('/', activityRouter)




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