import { SETTINGS } from "../src/main/settings";
const request = require("supertest");
import { app } from "../src/main/app";
import { VideoDbType } from "../src/db/video-db-type";

const data = {
  title: "string",
  author: "string",
  availableResolutions: ["P144"],
  canBeDownloaded: true,
  minAgeRestriction: 18,
  publicationDate: "2024-03-01T18:01:35.499Z",
};
const wrongData = {
  title: 48,
  author: 25,
  availableResolutions: ["P144"],
  canBeDownloaded: true,
  minAgeRestriction: 18,
  publicationDate: "2024-03-01T18:01:35.499Z",
};

const dbName = "back";
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;
let video: VideoDbType;
describe("./videos", () => {
  beforeAll(async () => {
    //Очищаем БД
    await request(app).delete("/testing/all-data");
  });

  //Проверяем что БД пустая
  it("should return 200 and empty []", async () => {
    // setDB()
    await request(app).get(SETTINGS.PATH.VIDEOS).expect(200, []);
  });

  it("Create new video with POST", async () => {
    const response = await request(app)
      .post("/videos")
      .send({
        title: "string",
        author: "string",
        availableResolutions: ["P144"],
      })
      .expect(201);
    expect(response.body.author).toBe("string");
    expect(response.body.title).toBe("string");
    expect(response.body.availableResolutions[0]).toBe("P144");
    video = response.body;
  });

  it("Returns the newly created video", async () => {
    const response = await request(app).get("/videos").expect(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toStrictEqual(video);
  });
  it("- POST does not create the video with incorrect data (no title, no author)", async () => {
    await request(app)
      .post("/videos/")
      .send({ title: "", author: "" })
      .expect(400, {
        errorsMessages: [
          { message: "Title must be a string", field: "title" },
          { message: "Author must be a string", field: "author" },
        ],
      });
    const res = await request(app).get("/videos/");
    expect(res.body.length).toEqual(1);
  });
  it("PUT video by id", async () => {
    const response = await request(app)
      .put("/videos/" + video.id)
      .send(data);
    expect(response.status).toBe(204);
    //expect(response.body.title).toBe("string");
  });
  it("PUT video by wrong data", async () => {
    const response = await request(app)
      .put("/videos/" + video.id)
      .send(wrongData);
    expect(response.status).toBe(400);
  });
  it("PUT video by wrong id", async () => {
    const response = await request(app).put("/videos/123456789").send(data);
    expect(response.status).toBe(404); // Incorrect id
  });
  it("Get video by id", async () => {
    const response = await request(app).get("/videos/" + video.id);
    expect(response.status).toBe(200);
  });
  it("GET video by wrong id", async () => {
    // Попытка получить данные по несуществующему ID
    const response = await request(app).get("/videos/123456789"); //Get by incorrect id
    expect(response.status).toBe(404);
  });
  it("Delete video by id", async () => {
    const response = await request(app).delete("/videos/" + video.id);
    expect(response.status).toBe(204);
  });

  it("DELETE video by wrong id", async () => {
    const response = await request(app).delete("/videos/123456789");
    expect(response.status).toBe(404);
  });

  it("Get video by id", async () => {
    // Попытка получить данные по удаленному id
    let response = await request(app).get("/videos/123456789"); //Get by incorrect id
    expect(response.status).toBe(404);
  });
  //update, get(id), delete(id), get(id)
});
