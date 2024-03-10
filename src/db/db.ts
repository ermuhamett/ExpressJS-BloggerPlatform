// import {VideoDBType} from './video-db-type'

export type DBType = {
  videos: any[]; // VideoDBType[]
  posts: any[];
  blogs:any[]
};

export const db: DBType = {
  videos: [],
  posts: [],
  blogs:[]
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.videos = [];
    // db.some = []
    return;
  }

  db.videos = dataset.videos || db.videos;
  // db.some = dataset.some || db.some
};
