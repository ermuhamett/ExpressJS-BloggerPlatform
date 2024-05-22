import jwt, {JwtPayload} from "jsonwebtoken"
import {SETTINGS} from "../../main/settings";
export const jwtService = {
    async createJwtToken(userId: string): Promise<string> {
        return jwt.sign({userId: userId}, SETTINGS.SECRET_KEY, {expiresIn: SETTINGS.JWT_TIME})
    },
    async createRefreshToken(userId:string,deviceId:string){
        return jwt.sign({userId:userId, deviceId},SETTINGS.SECRET_KEY,{expiresIn:SETTINGS.REFRESH_TIME})
    },
    async createPairToken(userId:string, deviceId:string){
        const accessToken=await this.createJwtToken(userId)
        const refreshToken=await this.createRefreshToken(userId, deviceId)
        return {accessToken,refreshToken}
    },
    async decodeToken(token:string){
      try {
          return jwt.decode(token)
      } catch (e) {
          console.log({decodeToken:'Cant decode token',e})
          return null
      }
    },
    async verifyToken(token:string):Promise<string | JwtPayload | null>{
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY)
        }catch (e) {
            console.log('Token verify error:', e); // Выводим содержимое исключения
            return null;
        }
    }
}