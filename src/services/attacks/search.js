import knex from "../../knex/knex"
import { transformAll } from "../../models/attacks"
import { normalizeKeepCase } from "normalize-diacritics-es"

const LIMIT = 25

export const search = async ({ fuzzy, requestedPage }) => {
  requestedPage = requestedPage && !isNaN(requestedPage) && parseInt(requestedPage, 10)

  const [attacksCount] = await knex("attacks")
    .whereNull("deleted_at")
    .where((builder) => {
      if (fuzzy) {
        if (/^\d+$/.test(fuzzy)) {
          builder.whereRaw(`unaccent(name) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`]).orWhere("year", fuzzy)
        } else {
          builder.whereRaw(`unaccent(name) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
        }
      }
    })
    .count()

  const totalCount = parseInt(attacksCount.count, 10)
  const maxPage = Math.ceil(totalCount / LIMIT)

  // set default to 1 if not correct or too little, set default to maxPage if too big
  const currentPage =
    !requestedPage || isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage > maxPage ? maxPage : requestedPage

  const offset = (currentPage - 1) * LIMIT

  const attacks = await knex("attacks")
    .whereNull("deleted_at")
    .where((builder) => {
      if (fuzzy) {
        if (/^\d+$/.test(fuzzy)) {
          builder.whereRaw(`unaccent(name) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`]).orWhere("year", fuzzy)
        } else {
          builder.whereRaw(`unaccent(name) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
        }
      }
    })
    .limit(LIMIT)
    .offset(offset)
    .orderBy([
      { column: "year", order: "desc" },
      { column: "created_at", order: "desc" },
    ])
    .select("id", "name", "year")

  return { attacks: attacks?.length ? transformAll(attacks) : [], byPage: LIMIT, currentPage, maxPage, totalCount }
}
