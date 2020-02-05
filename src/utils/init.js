import { API_URL, ATTACKS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"

export const fetchAttacks = async () => {
   console.log("Récupération des libellés des attentats")
   const response = await fetch(API_URL + ATTACKS_ENDPOINT)
   return handleAPIResponse(response)
}

export const fetchReferenceData = async () => {
   const attacks = await fetchAttacks()
   console.log("attacks", attacks)

   sessionStorage.setItem("attacks", JSON.stringify(attacks))
}

export const clearReferenceData = () => {
   sessionStorage.removeItem("attacks")
}
