import knex from "../../knex/knex"
import { untransform, validate } from "../../models/users"
import { APIError } from "../../utils/errors"
import { STATUS_401_UNAUTHORIZED, STATUS_406_NOT_ACCEPTABLE } from "../../utils/http"
import { SUPER_ADMIN } from "../../utils/roles"
import { findByEmail } from "./find"

export const create = async (user, currentUser) => {
  if (!currentUser) {
    throw new APIError({
      status: STATUS_401_UNAUTHORIZED,
      message: "Not authorized",
    })
  }

  await validate(user)

  if (currentUser.role !== SUPER_ADMIN) {
    if (!user.hospital || !user.hospital.id || !currentUser.hospital || !currentUser.hospital.id)
      throw new APIError({
        status: STATUS_401_UNAUTHORIZED,
        message: "Not authorized",
      })

    if (user.hospital.id !== currentUser.hospital.id) {
      throw new APIError({
        status: STATUS_401_UNAUTHORIZED,
        message: "Not authorized",
      })
    }
  }

  const otherUser = await findByEmail(user.email)

  if (otherUser) {
    throw new APIError({
      status: STATUS_406_NOT_ACCEPTABLE,
      message: "Email already used",
    })
  }

  const [newId] = await knex("users").insert(untransform(user), "id")

  return newId
}
