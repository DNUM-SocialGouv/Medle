import knex from "../knex/knex"
import { transform } from "../models/users"
import { compareWithHash } from "../utils/bcrypt"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED, STATUS_429_TOO_MANY_REQUESTS } from "../utils/http"
import { generateToken } from "../utils/jwt"
import { getLoginDelayConfig } from "../utils/loginDelay"

const validPassword = (password) => !!password?.length

export const authenticate = async (email, password) => {
  // normalize email
  email = email?.trim()
  // request verification
  if (!validPassword(password)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Incorrect password",
    })
  }

  // SQL query
  const [dbUser] = await knex("users")
    .leftJoin("hospitals", "users.hospital_id", "hospitals.id")
    .where(knex.raw(`lower(email) = ?`, email?.toLowerCase()))
    .whereNull("users.deleted_at")
    .select(
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.password",
      "users.role",
      "users.hospital_id",
      "hospitals.name as hospital_name",
      "hospitals.extra_data as hospital_extra_data",
      "users.scope",
      "users.login_attempts as loginAttempts",
      "users.login_last_attempt_at as loginLastAttemptAt",
    )

  const loginDelayConfig = getLoginDelayConfig()

  if (dbUser && (await compareWithHash(password, dbUser.password))) {
    /**
     * Si une configuration de rejeu est disponible on lance la temporisation
     */
    if (loginDelayConfig && !(await userCanLogin(dbUser, loginDelayConfig))) notifyDelay(loginDelayConfig)

    const user = transform(dbUser)
    const token = generateToken(user)

    return { user, token }
  } else {
    /**
     * Si l'utilisateur existe en base et qu'une configuration
     * de rejeu est disponible, on lance la temporisation
     */
    if (dbUser && loginDelayConfig && (await checkLoginDelay(dbUser, loginDelayConfig))) notifyDelay(loginDelayConfig)

    // Unauthorized path
    throw new APIError({
      status: STATUS_401_UNAUTHORIZED,
      message: "Erreur d'authentification",
    })
  }
}

const userCanLogin = async (dbUser, loginDelayConfig) => {
  if (!loginDelayConfig) return true

  if (dbUser.loginAttempts) {
    // L'utilisateur a déjà tenté de se connecter, sans succès

    if (dbUser.loginAttempts >= loginDelayConfig.attempts) {
      // Il a dépassé le nombre autorisé de tentatives, on vérifie la temporisation

      const userCanLoginAt = new Date(dbUser.loginLastAttemptAt)
      userCanLoginAt.setSeconds(userCanLoginAt.getSeconds() + loginDelayConfig.seconds)
      if (new Date().getTime() > userCanLoginAt.getTime()) {
        /**
         * L'utilisateur a suffisamment attendu : on nettoie la date de
         * la dernière tentative ainsi que le nombre de tentatives suite
         * à cette connexion réussie, et on l'autorise à se connecter
         */
        cleanLoginDelay(dbUser)
        return true
      } else {
        // L'utilisateur n'a pas assez attendu : on temporise de nouveau...
        addAttempt(dbUser)
        return false
      }
    } else {
      /**
       * Sinon on nettoie la date de la dernière tentative ainsi que
       * le nombre de tentatives suite à cette connexion réussie
       */
      cleanLoginDelay(dbUser)
      return true
    }
  } else {
    // L'utilisateur s'est connecté avec succès dernièrement
    return true
  }
}

const checkLoginDelay = async (dbUser, loginDelayConfig) => {
  if (!loginDelayConfig) return false

  if (dbUser.loginAttempts && dbUser.loginAttempts >= loginDelayConfig.attempts) {
    /**
     * Le nombre de tentatives dépasse celui autorisé :
     * on temporise et on ajoute une tentative de connexion
     */
    addAttempt(dbUser)
    return true
  } else {
    /**
     * Sinon, on ajoute une tentative de connexion à
     * l'utilisateur en base, mais on ne temporise pas
     */
    addAttempt(dbUser)
    return false
  }
}

const addAttempt = async (dbUser) => {
  await knex("users")
    .where("id", dbUser.id)
    .whereNull("deleted_at")
    .update({ login_attempts: ++dbUser.loginAttempts, login_last_attempt_at: knex.fn.now() })
}

const cleanLoginDelay = async (dbUser) => {
  await knex("users")
    .where("id", dbUser.id)
    .whereNull("deleted_at")
    .update({ login_attempts: null, login_last_attempt_at: null })
}

const notifyDelay = (loginDelayConfig) => {
  throw new APIError({
    status: STATUS_429_TOO_MANY_REQUESTS,
    message:
      "Trop de tentatives de connexion. Merci d'essayer de nouveau dans " + loginDelayConfig.seconds + " secondes",
  })
}
