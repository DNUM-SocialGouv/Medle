import { API_URL, ATTACKS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { logInfo } from "./logger"

export const fetchAttacks = async () => {
   logInfo("Récupération des libellés des attentats")
   const response = await fetch(API_URL + ATTACKS_ENDPOINT)
   return handleAPIResponse(response)
}

export const fetchReferenceData = async () => {
   const attacks = await fetchAttacks()

   sessionStorage.setItem("attacks", JSON.stringify(attacks))
}

export const clearReferenceData = () => {
   sessionStorage.removeItem("attacks")
}
