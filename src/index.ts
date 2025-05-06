import express from "express";
import cors from "cors";
import 'dotenv/config';
import { AppRouter } from "./AppRouter";
import 'colors'
import rateLimit from 'express-rate-limit'
import "./modules/auth/auth.controller";
import './modules/ticket/ticket.controller'
import errorHandler from "./middleware/error";
import DBconnection from "./config/db";
import { config } from "./config/env.config";

const app = express();
app.use(express.json());
app.use(cors());
const port = config.app.port || 8080;

app.use(AppRouter.getInstance())
app.use(errorHandler)

DBconnection()

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100, // 100 request per 10 mins
})
app.use(limiter)

app.listen(port, () => {
    console.log(`OTA service running port on ${port}`.green.bold);
});

