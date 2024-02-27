import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./utils/ErrorHandler.js";

const app = express();
app.use(
    cors({
        origin: () => {
            if (process.env.MODE === "DEV") {
                return "http://localhost:5173";
            }
        },
        credentials: true,
    })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/v1/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
