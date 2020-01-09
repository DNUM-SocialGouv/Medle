import { STATUS_200_OK } from "../../utils/http"

export default async (req, res) => {
   res.setHeader("Set-Cookie", `token=; Path=/; HttpOnly; Max-Age=10`) // 2 heures max. TODO: mettre en confi (cf. expiration JWT)
   res.status(STATUS_200_OK).end()
}
