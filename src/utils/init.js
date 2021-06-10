import { findAllAttacks } from "../clients/attacks"
import { findAllHospitals } from "../clients/hospitals"
import { logInfo } from "../utils/logger"

// TODO: passer à useSWR ou autre pour avoir un cache qui peut être update?
// Ex de problème : si le super admin supprime un hôpital, il le verra toujours (dans la liste des ETP) jusqu'à ce qu'il se reconnecte...
export const fetchReferenceData = async () => {
  logInfo("Récupération des libellés des données de référence")
  try {
    const attacks = await findAllAttacks()
    const hospitals = await findAllHospitals()

    sessionStorage.setItem("attacks", JSON.stringify(attacks.elements))
    sessionStorage.setItem("hospitals", JSON.stringify(hospitals))
  } catch (error) {
    console.error("Problème pour récupérer les données de référence")
    console.error(error)
  }
}

export const clearReferenceData = () => {
  sessionStorage.removeItem("attacks")
  sessionStorage.removeItem("hospitals")
}

export const getReferenceData = (key) => {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : []
  }
  return []
}
