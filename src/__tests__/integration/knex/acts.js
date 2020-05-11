import knex from "../../../knex/knex"
import { makeWhereClause } from "../../../services/acts/search"

describe("Test dynamic SQL queries built by Knex", () => {
  it("should display a correct where clause", async () => {
    const params = {
      scope: [1, 2],
      startDate: "2020-01-01",
      endDate: "2020-02-02",
    }
    const sql = await knex("acts").where(makeWhereClause(params)).toString()

    expect(sql).toMatchInlineSnapshot(
      `"select * from \\"acts\\" where (\\"acts\\".\\"deleted_at\\" is null and acts.hospital_id in (1,2) and examination_date >= TO_DATE('2020-01-01', 'YYYY-MM-DD') and examination_date <= TO_DATE('2020-02-02', 'YYYY-MM-DD'))"`
    )
  }),
    it("should display a correct where clause with hospitals", async () => {
      const params = {
        scope: [1, 2],
        startDate: "2019-01-01",
        endDate: "2020-02-02",
        hospitals: [1, 3],
      }
      const sql = await knex("acts").where(makeWhereClause(params)).toString()

      expect(sql).toMatchInlineSnapshot(
        `"select * from \\"acts\\" where (\\"acts\\".\\"deleted_at\\" is null and acts.hospital_id in (1,2) and examination_date >= TO_DATE('2019-01-01', 'YYYY-MM-DD') and examination_date <= TO_DATE('2020-02-02', 'YYYY-MM-DD'))"`
      )
    })
})
