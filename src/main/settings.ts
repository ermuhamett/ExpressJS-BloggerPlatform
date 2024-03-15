import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 3003,
  PATH: {
    VIDEOS: "/videos",
    DELETE: "/testing",
    POSTS:'/posts',
    BLOGS:'/blogs'
  },
};
