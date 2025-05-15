import express from "express";
import cors from "cors";
import 'dotenv/config';
import { AppRouter } from "./AppRouter";
import 'colors'
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import "./modules/auth/auth.controller";
import './modules/ticket/ticket.controller'
import "./modules/role/role.controller"
import "./modules/userRole/userRole.controller"
import "./modules/floor/floor.controller"
import "./modules/roomType/roomType.controller"
import errorHandler from "./middleware/error";
import DBconnection from "./config/db";
import { config } from "./config/env.config";
// import sendEmail from "./utils/sendEmail";
// import { ZohoApi } from "./utils/zohoApi";

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
// ZohoApi.sendMailTemplate("ioreadyrajapandi@gmail.com", "Raja")
// ZohoApi.sendMailTemplate("ioreadyrajapandi@gmail.com", "Raja")
//   .then(res => {
//     console.log("Email sent successfully:", res);
//   })
// 	.catch(err => {
// 	  console.log(err);
	  
//     console.error("Email sending failed:", err?.response?.data || err);
//   });

// ZohoApi.sendMail()
app.listen(port, () => {
	console.log(`OTA service running port on ${port}`.green.bold);
});

