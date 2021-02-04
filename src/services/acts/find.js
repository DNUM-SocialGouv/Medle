import knex from "../../knex/knex"
import { transform } from "../../models/acts"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { buildScope } from "../scope"
import { makeWhereClause } from "./common"

export const find = async ({ id }, currentUser) => {
  const reachableScope = buildScope(currentUser)

  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const [act] = await knex("acts")
    .leftJoin("askers", "acts.asker_id", "askers.id")
    .join("hospitals", "acts.hospital_id", "hospitals.id")
    .join("users", "acts.added_by", "users.id")
    .whereNull("acts.deleted_at")
    .where("acts.id", id)
    .where(makeWhereClause(reachableScope))
    .select([
      "acts.*",
      "askers.name as asker_name",
      "hospitals.name as hospital_name",
      "users.email as user_email",
      "users.first_name as user_first_name",
      "users.last_name as user_last_name",
    ])

  return act && transform(act)
}
