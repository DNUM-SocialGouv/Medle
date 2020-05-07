import knex from "../knex/knex"
import { compareWithHash } from "../utils/bcrypt"
import { generateToken } from "../utils/jwt"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED } from "../utils/http"
import { APIError } from "../utils/errors"
import { transform } from "../models/users"

const validPassword = (password) => !!password?.length

export const authenticate = async (email, password) => {
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
    .where("email", email)
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
