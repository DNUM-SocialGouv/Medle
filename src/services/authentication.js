import knex from "../knex/knex"
import { transform } from "../models/users"
import { compareWithHash } from "../utils/bcrypt"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED } from "../utils/http"
import { generateToken } from "../utils/jwt"

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
      "users.scope"
    )

  if (dbUser && (await compareWithHash(password, dbUser.password))) {
    const user = transform(dbUser)
    const token = generateToken(user)
    return { user, token }
  } else {
    // Unauthorized path
    throw new APIError({
      status: STATUS_401_UNAUTHORIZED,
      message: "Erreur d'authentification",
    })
  }
}
