import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./db/connectDb.js";
import routes from "./routers/routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [process.env.CLIENT_URL],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port: ${PORT}`);
});
