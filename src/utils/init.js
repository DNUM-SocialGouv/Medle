import { findAllAttacks } from "../clients/attacks"
import { logInfo } from "../utils/logger"

export const fetchReferenceData = async () => {
   logInfo("Récupération des libellés des attentats")
   const attacks = await findAllAttacks()

   sessionStorage.setItem("attacks", JSON.stringify(attacks))
}

export const clearReferenceData = () => {
   sessionStorage.removeItem("attacks")
}
