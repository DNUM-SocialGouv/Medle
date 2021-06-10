import knex from "../../knex/knex"
import { untransform, validate } from "../../models/attacks"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_403_FORBIDDEN } from "../../utils/http"

export const update = async ({ id }, attack) => {
  // Check if query and body are consistent
  if (!id || isNaN(id) || !attack || parseInt(id, 10) !== parseInt(attack.id, 10)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  attack = await validate(attack)

  const [otherAttack] = await knex("attacks")
    .whereNull("deleted_at")
    .where("name", attack.name)
    .where("year", attack.year)
    .whereNot("id", attack.id)

  if (otherAttack)
    throw new APIError({
      status: STATUS_403_FORBIDDEN,
      message: "Attack already present",
    })

  const number = await knex("attacks").update(untransform(attack)).where("id", id)

  return number
}
