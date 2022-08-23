import knex from "../../knex/knex"
import { untransform } from "../../models/acts"
import { isSubmittedActCorrect } from "../../utils/actsConstants"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED } from "../../utils/http"

const examinationsOnlyIML = ["Autopsie", "Anthropologie", "Odontologie"]

export const create = async (data, currentUser) => {
  if (!data?.hospitalId) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  if (!isSubmittedActCorrect(data)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  await knex("acts")
    .where("internal_number", data.internalNumber)
    .where("hospital_id", data.hospitalId)
    .whereNull("deleted_at")
    .select("*")
    .then(([internalNumberExist]) => {
      if (internalNumberExist) {
        throw new APIError({
          status: STATUS_400_BAD_REQUEST,
          message: "Le numéro interne saisi existe déjà.",
        })
      }
    })

  if (!currentUser?.id || data.addedBy !== currentUser.id) {
    throw new APIError({
      status: STATUS_401_UNAUTHORIZED,
      message: "Not authorized",
    })
  }

  if (!currentUser?.hospital || data.hospitalId !== currentUser.hospital.id) {
    throw new APIError({
      status: STATUS_401_UNAUTHORIZED,
      message: "Not authorized",
    })
  }

  // examinations are limited for UMJ structures for deceased profile
  if (data.profile === "Personne décédée" && !currentUser.hospital.canDoPostMortem) {
    data.examinationTypes.forEach((elt) => {
      if (examinationsOnlyIML.includes(elt)) {
        throw new APIError({
          status: STATUS_400_BAD_REQUEST,
          message: "Bad request",
        })
      }
    })
  }

  const [id] = await knex("acts").insert(untransform(data), "id")

  return id
}
