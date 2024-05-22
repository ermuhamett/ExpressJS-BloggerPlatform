import { Request, Response } from "express";
import { db } from "../db/db";
export const deleteAllVideoController = (req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(204);
};
