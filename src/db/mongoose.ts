import {SETTINGS} from "../main/settings";
import mongoose from "mongoose";
export const connectToDb = async()=>{
    const uri=SETTINGS.LOCAL_MONGO_URL
    const dbName=SETTINGS.DB_NAME
    if(!uri || !dbName){
        throw new Error('!!! MONGODB_URI or DB_NAME not found')
    }
    try {
        await mongoose.connect(uri,{dbName})
        console.log("Pinged your deployment. You successfully connected to mongoose!")
        return true
    }catch (error) {
        console.dir('!!! Can\'t connect to mongoose!', error)
        await mongoose.disconnect()
        return false
    }
}

export const closeDb=async()=>{
    await mongoose.disconnect()
}