import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbConnect from "./dbConnect";
import productRoutes from "./routes/products";

const app = express();

dbConnect();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/products", productRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
