import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, STATUS_200_OK, STATUS_500_INTERNAL_SERVER_ERROR } from "../../../utils/http"
import { ACTIVITY_RUN } from "../../../utils/roles"
import { initPreSummaryActivity } from "../../../cron/init-pre-summary-activity"
import { initSummaryActivity } from "../../../cron/init-summary-activity"

const handler = async (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
    res.setHeader("Access-Control-Allow-Credentials", "false")

    try {
        switch (req.method) {
            case METHOD_GET: {
                checkValidUserWithPrivilege(ACTIVITY_RUN, req, res)

                return initPreSummaryActivity().then((knex) => initSummaryActivity(knex).then(() =>
                    res
                        .status(STATUS_200_OK)
                        .json({ resp: 'ok' })
                )).catch((error) => res
                    .status(STATUS_500_INTERNAL_SERVER_ERROR)
                    .json({ error }))
            }
            default:
                if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
        }
    } catch (error) {
        sendAPIError(error, res)
    }
}

const cors = Cors({
    allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
