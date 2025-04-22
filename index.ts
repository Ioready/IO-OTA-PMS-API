import express from "express";
import cors from "cors";
import 'dotenv/config';


const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`OTA service running port on ${port}`);
});  

