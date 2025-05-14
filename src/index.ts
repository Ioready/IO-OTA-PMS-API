import express from "express";
import cors from "cors";
import 'dotenv/config';
import { AppRouter } from "./AppRouter";
import 'colors'
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import "./modules/auth/auth.controller";
import './modules/ticket/ticket.controller'
import errorHandler from "./middleware/error";
import DBconnection from "./config/db";
import { config } from "./config/env.config";
import sendEmail from "./utils/sendEmail";

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors());

const port = config.app.port || 8080;

DBconnection()

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100, // 100 request per 10 mins
	handler: (_req, _res, next) => {
		const error: any = new Error("Too many requests, please try again later.");
		error.statusCode = 429;
		next(error);
	}
})
app.use(limiter)

app.use(AppRouter.getInstance())
app.use(errorHandler)
sendEmail({
				template: 'Test',
				email: "ioreadyrajapandi@gmail.com",
				locals: {
					
				},
			})
app.listen(port, () => {
	console.log(`OTA service running port on ${port}`.green.bold);
});

