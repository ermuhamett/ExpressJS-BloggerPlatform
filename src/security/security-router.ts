import {Router} from "express";
import {securityController} from "../main/composition-root";

export const securityRouter=Router()
//TODO Security сделано приблизительно по DI
securityRouter.get('/devices', securityController.getDevices.bind(securityController))
securityRouter.delete('/devices',securityController.deleteDevices.bind(securityController))
securityRouter.delete('/devices/:deviceId',securityController.deleteDeviceById.bind(securityController))