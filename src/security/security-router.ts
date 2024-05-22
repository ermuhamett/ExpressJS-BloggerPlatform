import {Router} from "express";
import {container} from "../main/composition-root";
import {SecurityController} from "./securityController";

export const securityRouter=Router()
const securityController=container.resolve<SecurityController>(SecurityController)
//TODO Security сделано приблизительно по DI
securityRouter.get('/devices', securityController.getDevices.bind(securityController))
securityRouter.delete('/devices',securityController.deleteDevices.bind(securityController))
securityRouter.delete('/devices/:deviceId',securityController.deleteDeviceById.bind(securityController))