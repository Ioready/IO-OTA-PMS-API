import express from "express";
import cors from "cors";
import 'dotenv/config';
import { AppRouter } from "./AppRouter";
import 'colors'
import "./modules/auth/auth.controller";
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

app.listen(port, () => {
    console.log(`OTA service running port on ${port}`.green.bold);
});

