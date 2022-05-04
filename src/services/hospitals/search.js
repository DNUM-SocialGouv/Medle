import knex from "../../knex/knex"
import { transformAll } from "../../models/hospitals"
import { canAccessAllHospitals } from "../../utils/roles"
import { buildScope } from "../../utils/scope"

export const search = async (fuzzy) => {
  const hospitals = await knex("hospitals")
    .whereNull("deleted_at")
    .where((builder) => {
      if (fuzzy) {
        builder.where("name", "ilike", `%${fuzzy}%`)
      }
    })
    .orderBy("postal_code")

  return hospitals?.length ? transformAll(hospitals) : []
}

/**
 * Get available hospitals of user (version for server side)
 *
 * @param {User} user
 * @returns Hospitals[]
 */
export async function hospitalsOfUser(user, { fuzzy } = {}) {
  const allHospitals = await search(fuzzy)
  const scopeUser = buildScope(user)
  const hospitals = canAccessAllHospitals(user)
    ? allHospitals
    : allHospitals.filter((hospital) => scopeUser.includes(hospital.id))

  return hospitals
}
