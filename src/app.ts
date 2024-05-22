import express from "express";
import { videosRouter } from "./videos";
import { SETTINGS } from "./settings";
import { testingRouter } from "./testing";

export const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//   res.status(200).json({ hello: "world" });
// });
// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
app.use(SETTINGS.PATH.DELETE, testingRouter);
app.use(SETTINGS.PATH.VIDEOS, videosRouter);

/*export const RouterPath = {
  videos: "",
};*/
