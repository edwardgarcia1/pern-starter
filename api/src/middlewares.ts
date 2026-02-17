import type { NextFunction, Request, Response } from "express";
import type ApiResponse from "./interfaces/api-response";

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
}

export function errorHandler(err: Error, req: Request, res: Response<ApiResponse>, _next: NextFunction) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        success: false,
        error: {
            message: err.message,
            stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
        }
    });
}