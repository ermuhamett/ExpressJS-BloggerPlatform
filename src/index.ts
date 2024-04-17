import { app } from "./main/app";
import { SETTINGS } from "./main/settings";
import {addRoutes} from "./main/routes";
import {closeDB, connectToDB, postCollection} from "./db/mongo-db";

const bootstrap = async () => {
  addRoutes(app)
  if(!await connectToDB()){
    console.log('stop')
    await closeDB()
    process.exit(1)
  }
  app.listen(SETTINGS.PORT, async() => {
    console.log("...server started");
    console.log(await postCollection.find().toArray())
  });
}

bootstrap()
