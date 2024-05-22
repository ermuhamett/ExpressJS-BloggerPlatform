import {Router} from "express";
import {getDevicesController} from "./controllers/getDeviceController";
import {deleteDevicesController} from "./controllers/deleteDevicesController";
import {deleteDeviceById} from "./controllers/deleteDeviceById";

export const securityRouter=Router()

securityRouter.get('/devices', getDevicesController)
securityRouter.delete('/devices',deleteDevicesController)
securityRouter.delete('/devices/:deviceId',deleteDeviceById)