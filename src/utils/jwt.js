import * as jwt from "jsonwebtoken"

const jwtConfig = {
   secret: "JHo$aY@2&o7m", // TODO: à mettre dans process.ENV
   options: {
      expiresIn: "2h",
      algorithm: "HS256",
   },
}

export const checkToken = token => {
   return jwt.verify(token, jwtConfig.secret, jwtConfig.options)
}

export const decodeToken = token => {
   return jwt.decode(token)
}

export const generateToken = ({
   id,
   first_name: firstName,
   last_name: lastName,
   email,
   role,
   hospital_id: hospitalId,
   scope,
}) =>
   jwt.sign(
      {
         id,
         firstName,
         lastName,
         email,
         role,
         hospitalId,
         scope,
      },
      jwtConfig.secret,
      jwtConfig.options,
   )
