import * as jwt from "jsonwebtoken"
import getConfig from "next/config"

import { timeout } from "../config"

const { serverRuntimeConfig } = getConfig() || {}

const jwtConfig = {
  options: {
    algorithm: "HS256",
    expiresIn: timeout.jwt,
  },
  // default value is only for development environment.
  secret: (serverRuntimeConfig && serverRuntimeConfig.JWT_SECRET) || "JHo$aY@2&o7m",
}

/**
 * Verify the validity of the token.
 *
 * @param {string} token  - The JWT token.
 * @returns The decodified token.
 * @throws Error (see https://www.npmjs.com/package/jsonwebtoken#errors--codes).
 */
export const checkToken = (token) => {
  return jwt.verify(token, jwtConfig.secret, jwtConfig.options)
}

/**
 * Decode the token without validating it.
 *
 * @param {string} token  - The JWT token.
 * @returns The decodified token.
 */
export const decodeToken = (token) => {
  return jwt.decode(token)
}

/**
 * Generate JWT token for a user.
 *
 * @param {Object} user             - User to tokenize. See "type" in src/models/users.
 * @param {Object} options          - Options object.
 * @param {string} options.timeout  - Timeout to override the default value (ex: "1H" for 1 hour).
 * @returns JWT token
 */
export const generateToken = (user, { timeout } = {}) => {
  const options = !timeout ? jwtConfig.options : { ...jwtConfig.options, expiresIn: timeout }

  return jwt.sign(user, jwtConfig.secret, options)
}
