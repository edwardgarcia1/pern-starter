import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import ApiResponse from "./interfaces/api-response";
import * as middlewares from "./middlewares";

const app = express();
const allowedOrigins = ["http://localhost:5173"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("CORS blocked for origin: ", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "platform"],
        credentials: true,
    }),
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get<object, ApiResponse>("/", (req, res) => {
    res.json({
        success: true,
        data: "API running"
    });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;