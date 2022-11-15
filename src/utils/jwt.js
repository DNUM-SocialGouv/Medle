import * as jwt from "jsonwebtoken"
import moment from "moment"
import getConfig from "next/config"

import { timeoutConfig } from "../config"

const { serverRuntimeConfig } = getConfig() || {}

const jwtConfig = {
  options: {
    algorithm: "HS256",
    expiresIn: timeoutConfig.jwt,
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

  /*
   * Dans le token, on ajoute le paramétrage pour son renouvelement et sa durée de vie maximale :
   * - authStartedAt : Horodatage de création du token
   * - authRefreshStart : Horodatage déclenchant l'actualisation du token
   * - authMaxDuration : Horodatage indiquant la durée de vie maximale du token
   */
  const currentMoment = moment()

  // Horodatage de création du token (nouveau ou renouvelé)
  user.authStartedAt = currentMoment

  // Horodatage déclenchant l'actualisation du token
  // Mis à jour lors du renouvelement du token (voir /pages/api/refresh-token.js) sinon créé lors de la première authentification
  if (!user.authRefreshStart) {
    user.authRefreshStart = moment(currentMoment).add(timeoutConfig.authRefreshStart)
  }

  // Horodatage indiquant la durée de vie maximale du token
  // Créé lors de la première authentification et ne doit pas être mis à jour
  if (!user.authMaxDuration) {
    user.authMaxDuration = moment(currentMoment).add(timeoutConfig.authMaxDuration)
  }

  return jwt.sign(user, jwtConfig.secret, options)
}
