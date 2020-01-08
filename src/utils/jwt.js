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

export const generateToken = ({ id, first_name, last_name, email, role, hospital_id, scope }) =>
   jwt.sign(
      {
         id,
         first_name,
         last_name,
         email,
         role,
         hospital_id,
         scope,
      },
      jwtConfig.secret,
      jwtConfig.options,
   )
