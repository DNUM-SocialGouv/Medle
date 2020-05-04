import knex from "../../knex/knex"
import { untransform, validate } from "../../models/hospitals"

export const create = async (hospital) => {
  await validate(hospital)

  const [newId] = await knex("hospitals").insert(untransform(hospital), "id")

  return newId
}
