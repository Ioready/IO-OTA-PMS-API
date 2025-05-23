import express from "express";
import cors from "cors";
import 'dotenv/config';
import { AppRouter } from "./AppRouter";
import 'colors'
// import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import "./modules/auth/auth.controller";
import './modules/ticket/ticket.controller'
import "./modules/role/role.controller"
import "./modules/userRole/userRole.controller"
import "./modules/floor/floor.controller"
import "./modules/roomType/roomType.controller"
import "./modules/property/property.controller"
import "./modules/room/room.controller"
import "./modules/ratePlan/ratePlan.controller"
import "./modules/recentSearch/search.controller"
import "./modules/user/user.controller"
import "./modules/lostAndFound/lostAndFound.controller"
import "./modules/task/task.controller"
import "./modules/settings/cancelPolicy.controller"
import "./modules/cloudinary/cloudinary.controller"
import errorHandler from "./middleware/error";
import DBconnection from "./config/db";
import { config } from "./config/env.config";
import { setLanguage } from "./middleware/setLanguages";

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
	origin: ['http://localhost:5000', 'https://otelsoft.vercel.app'],// your frontend origin
	credentials: true
}));
app.use(setLanguage);

const port = config.app.port || 8080;
DBconnection()

// Rate limiting
// const limiter = rateLimit({
// 	windowMs: 10 * 60 * 1000, // 10 mins
// 	max: 100, // 100 request per 10 mins
// 	handler: (_req, _res, next) => {
// 		const error: any = new Error("Too many requests, please try again later.");
// 		error.statusCode = 429;
// 		next(error);
// 	}
// })
// app.use(limiter)

app.use((req, _res, next) => {
	globalThis.currentReq = req;
	next();
});

app.use(AppRouter.getInstance())
app.use(errorHandler)
app.listen(port, () => {
	console.log(`OTA service running port on ${port}`.green.bold);
});

