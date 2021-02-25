import knex from "../../knex/knex"
import { transform } from "../../models/users"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { buildScope } from "../scope"
import { makeWhereClause } from "./common"

export const find = async ({ id, currentUser }) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const scope = buildScope(currentUser)

  let [user] = await knex("users")
    .leftJoin("hospitals", "users.hospital_id", "hospitals.id")
    .where("users.id", id)
    .where(makeWhereClause({ scope }))
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
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
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
      "users.scope"
    )

  user = transform(user)

  return user
}
