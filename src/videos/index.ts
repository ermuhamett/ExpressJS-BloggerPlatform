import { Router } from "express";
import { getVideosController } from "./getVideosController";
import { createVideoController } from "./createVideoController";
import { getVideoController } from "./getVideoController";
import { deleteVideoController } from "./deleteVideoController";
import { updateVideoController } from "./updateVideoController";
import {
  InputVideoType,
  Resolutions,
  UpdateVideoType,
} from "../input-output-types/video-types";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { log } from "util";

export const inputValidation = (video: InputVideoType) => {
  const errors: OutputErrorsType = {
    errorsMessages: [],
  };
  if (
    typeof video.title !== "string" ||
    video.title.length === 0 ||
    video.title.length > 40
  ) {
    errors.errorsMessages.push({
      message: "Title must be a string",
      field: "title",
    });
  }

  if (
    typeof video.author !== "string" ||
    video.author.length === 0 ||
    video.author.length > 20
  ) {
    errors.errorsMessages.push({
      message: "Author must be a string",
      field: "author",
    });
  }
  if (Array.isArray(video.availableResolutions)) {
    video.availableResolutions.map(
      (r) =>
        !Resolutions.includes(r) &&
        errors.errorsMessages.push({
          message: "error!!!!",
          field: "availableResolutions",
        }),
    );
  }
  return errors;
};

export const putUpdateValidation = (video: UpdateVideoType) => {
  const errors: OutputErrorsType = {
    errorsMessages: [],
  };
  if (
    typeof video.title !== "string" ||
    video.title.length === 0 ||
    video.title.length > 40
  ) {
    errors.errorsMessages.push({
      message: "Title must be a string",
      field: "title",
    });
  }

  if (
    typeof video.author !== "string" ||
    video.author.length === 0 ||
    video.author.length > 20
  ) {
    errors.errorsMessages.push({
      message: "Author must be a string",
      field: "author",
    });
  }
  if (typeof video.canBeDownloaded !== "boolean") {
    errors.errorsMessages.push({
      message: "CanBeDownloaded must be a boolean",
      field: "canBeDownloaded",
    });
  }
  if (typeof video.minAgeRestriction === "number") {
    video.minAgeRestriction < 1 ||
      (video.minAgeRestriction > 18 &&
        errors.errorsMessages.push({
          message: "error!!!!",
          field: "minAgeRestriction",
        }));
  } else {
    video.minAgeRestriction = null;
  }
  const dateInspection: boolean =
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/gi.test(video.publicationDate);
  if (typeof video.publicationDate != "undefined" && !dateInspection) {
    errors.errorsMessages.push({
      message: "Invalid publicationDate",
      field: "publicationDate",
    });
  }
  if (typeof video)
    if (Array.isArray(video.availableResolutions)) {
      video.availableResolutions.map(
        (r) =>
          !Resolutions.includes(r) &&
          errors.errorsMessages.push({
            message: "error!!!!",
            field: "availableResolutions",
          }),
      );
    }
  return errors;
};
export const videosRouter = Router();

videosRouter.get("/", getVideosController);
videosRouter.post("/", createVideoController);
videosRouter.get("/:id", getVideoController);
videosRouter.put("/:id", updateVideoController);
videosRouter.delete("/:id", deleteVideoController);
