import {Router} from "express";
import {authService} from "./auth-service";
import {jwtMiddleware} from "../middleware/jwtMiddleware";
export const authRouter=Router()

authRouter.post("/login", authService.loginCheck)
authRouter.get("/me", jwtMiddleware, authService.currentUser)