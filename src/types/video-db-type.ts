import { Resolutions } from "../input-output-types/video-types";

export type VideoDbType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: typeof Resolutions;
};
