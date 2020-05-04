import knex from "../../knex/knex"
import { transformAll } from "../../models/askers"

const LIMIT = 50

export const search = async ({ fuzzy, requestedPage }) => {
  requestedPage = requestedPage && !isNaN(requestedPage) && parseInt(requestedPage, 10)

  const [askersCount] = await knex("askers")
    .whereNull("deleted_at")
    .where((builder) => {
      if (fuzzy) {
        builder.where("name", "ilike", `%${fuzzy}%`)
        // TODO: add this better query when all askers would have got a depCode
        //builder.where("name", "ilike", `%${fuzzy}%`).orWhere("dep_code", "like", `%${fuzzy}%`)
      }
    })
    .count()

  const totalCount = parseInt(askersCount.count)
  const maxPage = Math.ceil(totalCount / LIMIT)

  // set default to 1 if not correct or too little, set default to maxPage if too big
  const currentPage =
    !requestedPage || isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage > maxPage ? maxPage : requestedPage

  const offset = (currentPage - 1) * LIMIT

  const askers = await knex("askers")
    .whereNull("deleted_at")
    .where((builder) => {
      if (fuzzy) {
        builder.where("name", "ilike", `%${fuzzy}%`)
        // builder.where("name", "ilike", `%${fuzzy}%`).orWhere("dep_code", "like", `%${fuzzy}%`)
      }
    })
    .limit(LIMIT)
    .offset(offset)
    .orderBy("name", "id")

  return { askers: askers?.length ? transformAll(askers) : [], totalCount, currentPage, maxPage, byPage: LIMIT }
}
