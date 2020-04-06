import * as jwt from "jsonwebtoken"
import getConfig from "next/config"
import { timeout } from "../config"
const { serverRuntimeConfig } = getConfig() || {}

const jwtConfig = {
   secret: (serverRuntimeConfig && serverRuntimeConfig.JWT_SECRET) || "JHo$aY@2&o7m", // only for dev
   options: {
      expiresIn: timeout.jwt,
      algorithm: "HS256",
   },
}

export const checkToken = token => {
   return jwt.verify(token, jwtConfig.secret, jwtConfig.options)
}

export const decodeToken = token => {
   return jwt.decode(token)
}

export const generateToken = user => jwt.sign(user, jwtConfig.secret, jwtConfig.options)
