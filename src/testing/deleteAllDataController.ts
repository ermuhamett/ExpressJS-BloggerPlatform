import { Request, Response } from "express";
import {blogCollection, commentCollection, db, postCollection, userCollection} from "../db/mongo-db";
export const deleteAllDataController = async(req: Request, res: Response) => {
  //await db.dropDatabase()
  await blogCollection.deleteMany({})
  await postCollection.deleteMany({})
  await userCollection.deleteMany({})
  await commentCollection.deleteMany({})
  res.sendStatus(204);
  return
};
