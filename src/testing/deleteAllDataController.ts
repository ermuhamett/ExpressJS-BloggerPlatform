import { Request, Response } from "express";
import {blogCollection, db, postCollection} from "../db/mongo-db";
export const deleteAllDataController = async(req: Request, res: Response) => {
  //await db.dropDatabase()
  await blogCollection.deleteMany({})
  await postCollection.deleteMany({})
  res.sendStatus(204);
  return
};
