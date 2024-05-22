import { app } from "./main/app";
import { SETTINGS } from "./main/settings";
import {addRoutes} from "./main/routes";
import {appMiddleware} from "./middleware/appMiddleware";
import {closeDb, connectToDb} from "./db/mongoose";
const bootstrap = async () => {
  appMiddleware(app);
  addRoutes(app)
  if(!await connectToDb()){
    console.log('stop')
    await closeDb()
    process.exit(1)
  }
  app.listen(SETTINGS.PORT, async() => {
    console.log("...server started");
  });
}

bootstrap()
