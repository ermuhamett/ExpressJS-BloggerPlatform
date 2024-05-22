import { Router } from "express";
import { deleteAllVideoController } from "./deleteAllVideoController";

export const testingRouter = Router();

testingRouter.delete("/all-data", deleteAllVideoController);
