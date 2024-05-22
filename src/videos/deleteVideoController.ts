import { Request, Response } from "express";
import { db } from "../db/db";

export const deleteVideoController = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = +req.params.id;
  const videoIndex = db.videos.findIndex((v) => v.id === id);
  if (videoIndex === -1) {
    res.sendStatus(404);
    return;
  }
  const video = db.videos.splice(videoIndex, 1);
  res.sendStatus(204);
};
