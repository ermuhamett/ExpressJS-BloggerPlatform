import { app } from "./main/app";
import { SETTINGS } from "./main/settings";
import {addRoutes} from "./main/routes";
import {closeDB, connectToDB} from "./db/mongo-db";
import {appMiddleware} from "./middleware/appMiddleware";
const bootstrap = async () => {
  appMiddleware(app);
  addRoutes(app)
  if(!await connectToDB()){
    console.log('stop')
    await closeDB()
    process.exit(1)
  }
  app.listen(SETTINGS.PORT, async() => {
    console.log("...server started");
  });
}

bootstrap()
