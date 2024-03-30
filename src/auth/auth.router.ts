import {Router} from "express";
import {authService} from "./auth-service";
export const authRouter=Router()

authRouter.post("/login", authService.loginCheck)