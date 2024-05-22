import { Request, Response } from "express";
import { db } from "../db/db";
import {
  InputVideoType,
  OutputVideoType,
  Resolutions,
} from "../input-output-types/video-types";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { VideoDbType } from "../db/video-db-type";
import { inputValidation } from "./index";

export type ParamType = {
  id: string;
};

export type BodyType = {
  id: number;
  title: string;
};

export type QueryType = {
  search?: string;
};

export const someController = (
  req: Request<ParamType, any, BodyType, QueryType>,
  res: Response<void | OutputErrorsType>,
) => {};

export const createVideoController = (
  req: Request<any, any, InputVideoType>,
  res: Response<OutputVideoType | OutputErrorsType>,
) => {
  const errors = inputValidation(req.body);
  if (errors.errorsMessages.length) {
    res.status(400).json(errors);
    return;
  }
  const createdAt = new Date();
  const publicationDate = new Date();
  publicationDate.setDate(createdAt.getDate() + 1);
  const newVideo: VideoDbType = {
    ...req.body,
    id: Date.now() + Math.random(),
    publicationDate: publicationDate.toISOString(),
    createdAt: createdAt.toISOString(),
    minAgeRestriction: null,
    canBeDownloaded: false,
  };
  db.videos = [...db.videos, newVideo];

  res.status(201).json(newVideo);
};
