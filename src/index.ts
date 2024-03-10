import { app } from "./main/app";
import { SETTINGS } from "./main/settings";

app.listen(SETTINGS.PORT, () => {
  console.log("...server started");
});
