import knex from "../../knex/knex"
import { untransform, validate } from "../../models/attacks"
import { APIError } from "../../utils/errors"
import { STATUS_403_FORBIDDEN } from "../../utils/http"

export const create = async (attack) => {
  await validate(attack)

  const [otherAttack] = await knex("attacks")
    .whereNull("deleted_at")
    .where("name", attack.name)
    .where("year", attack.year)

  if (otherAttack)
    throw new APIError({
      status: STATUS_403_FORBIDDEN,
      message: "Attack already present",
    })

  const [newId] = await knex("attacks").insert(untransform(attack), "id")

  return newId
}
