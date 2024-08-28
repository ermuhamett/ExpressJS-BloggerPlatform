import express, {Express} from "express";
import cookieParser from "cookie-parser";
export const appMiddleware = (app:Express) => {
    app.use(express.json());
    app.use(cookieParser())
    app.set('trust proxy', true)
}