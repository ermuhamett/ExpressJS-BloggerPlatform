import { Request, Response } from "express";
import { UpdateVideoType } from "../input-output-types/video-types";
import { putUpdateValidation } from "./index";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { db } from "../db/db";
export const updateVideoController = (
  req: Request<{ id: string }>,
  res: Response<UpdateVideoType | OutputErrorsType>,
) => {
  const videoId = req.params.id;
  if (!videoId) {
    res.sendStatus(400);
    return;
  }
  const errors = putUpdateValidation(req.body);
  if (errors.errorsMessages.length) {
    res.status(400).json(errors);
    return;
  }
  const videoToUpdateIndex = db.videos.findIndex(
    (video) => video.id == videoId,
  );
  if (videoToUpdateIndex === -1) {
    res.sendStatus(404);
    return;
  }
  db.videos[videoToUpdateIndex] = {
    ...db.videos[videoToUpdateIndex],
    ...req.body,
  };
  return res.status(204).json(db.videos[videoToUpdateIndex]);
};
