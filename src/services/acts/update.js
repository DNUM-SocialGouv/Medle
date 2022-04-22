import knex from "../../knex/knex"
import { untransform } from "../../models/acts"
import { isSubmittedActCorrect } from "../../utils/actsConstants"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED } from "../../utils/http"
import { buildScope } from "../../utils/scope"

export const update = async ({ id }, data, currentUser) => {
  if (!id || isNaN(id) || !data || !data.hospitalId) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  if (!isSubmittedActCorrect(data)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const reachableScope = buildScope(currentUser)

  if (!reachableScope || !reachableScope.includes(data.hospitalId)) {
    throw new APIError({
      message: "Not authorized",
      status: STATUS_401_UNAUTHORIZED,
    })
  }

  const number = await knex("acts").update(untransform(data)).where("id", id)

  return number
}
