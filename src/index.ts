import express from "express";
import cors from "cors";
import 'dotenv/config';
import { AppRouter } from "./AppRouter";
import 'colors'


const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8080;
import "./modules/auth/auth.controller";
import errorHandler from "./middleware/error";
// import DBconnection from "./config/db";
app.use(AppRouter.getInstance())

app.use(errorHandler)

// DBconnection()

app.listen(port, () => {
    console.log(`OTA service running port on ${port}`.yellow.bold);
});

