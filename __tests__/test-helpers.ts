import { app } from "../src/main/app";
import { agent } from "supertest";

export const req = agent(app);
