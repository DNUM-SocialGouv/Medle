import Cors from "micro-cors"

import knex from "../../../knex/knex"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   METHOD_GET,
   METHOD_OPTIONS,
} from "../../../utils/http"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import { checkValidUserWithPrivilege, sendAPIError } from "../../../utils/api"

const handler = async (req, res) => {
   try {
      // privilege verification
      checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

      // request verification
      const { id } = req.query
      if (!id || isNaN(id)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      // SQL query
      const [askers] = await knex("askers").where("id", id)

      if (askers) {
         return res.status(STATUS_200_OK).json(askers)
      } else {
         return res.status(STATUS_404_NOT_FOUND).end()
      }
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
