// import {VideoDBType} from '../src/db/video-db-type'
// import {Resolutions} from '../src/input-output-types/video-types'
import { DBType } from "../src/db/db";
import {PostInputModel} from "../src/db/post-db-type";

export const video1: any /*VideoDBType*/ = {
  id: Date.now() + Math.random(),
  title: "t" + Date.now() + Math.random(),
  // author: 'a' + Date.now() + Math.random(),
  // canBeDownloaded: true,
  // minAgeRestriction: null,
  // createdAt: new Date().toISOString(),
  // publicationDate: new Date().toISOString(),
  // availableResolution: [Resolutions.P240],
};

// ...

// export const postData:PostInputModel={
//   title: 'Test Post',
//   shortDescription: 'Test Short Description',
//   content: 'Test Content',
// }

// ...
