import express from "express";
import {addRoutes} from "./routes";

export const app = express();
app.use(express.json());

addRoutes(app)


//app.use(SETTINGS.PATH.DELETE, testingRouter);
//app.use(SETTINGS.PATH.VIDEOS, videosRouter);

/*export const RouterPath = {
  videos: "",
};*/
