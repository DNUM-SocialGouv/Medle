import knex from "../../knex/knex"
import { transform } from "../../models/users"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { ADMIN_HOSPITAL } from "../../utils/roles"
import { buildScope } from "../../utils/scope"
import { makeWhereClause } from "./common"

export const find = async ({ id, currentUser }) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  const scope = buildScope(currentUser)
  let query = knex("users")
    .leftJoin("hospitals", "users.hospital_id", "hospitals.id")
    .where("users.id", id)
    .where(makeWhereClause({ scope }))

  if (currentUser.role === ADMIN_HOSPITAL) {
    query = query.where("users.hospital_id", currentUser?.hospital?.id)
  }

  let [user] = await query.select(
    "users.id",
    "users.first_name",
    "users.last_name",
    "users.email",
    "users.password",
    "users.role",
    "users.hospital_id",
    "hospitals.name as hospital_name",
    "users.scope",
    "users.reset_password",
  )

  user = transform(user)

  if (user?.scope?.length) {
    const userScope = await knex("hospitals").whereNull("deleted_at").whereIn("id", user.scope).select("id", "name")

    user = { ...user, scope: userScope }
  }

  return user
}

export const findByEmail = async (email) => {
  if (!email) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  let [user] = await knex("users")
    .where("users.email", email)
    .whereNull("deleted_at")
    .select(
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.password",
      "users.role",
      "users.hospital_id",
      "users.scope",
    )

  user = transform(user)

  return user
}

export const findById = async (id) => {
  if (!id) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  let [user] = await knex("users")
    .where("users.id", id)
    .whereNull("deleted_at")
    .select(
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.password",
      "users.role",
      "users.hospital_id",
      "users.scope",
    )

  user = transform(user)

  return user
}
