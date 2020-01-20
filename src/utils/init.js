import { API_URL, ATTACKS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"

export const fetchReferenceData = async () => {
   console.log("Récupération des libellés des attentats")
   const response = await fetch(API_URL + ATTACKS_ENDPOINT)
   const attacks = await handleAPIResponse(response)

   console.log("attacks", attacks)

   sessionStorage.setItem("attacks", JSON.stringify(attacks))
}

export const clearReferenceData = () => {
   sessionStorage.removeItem("attacks")
}
