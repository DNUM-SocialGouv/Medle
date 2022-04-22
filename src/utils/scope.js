/**
 * In DB, the hospital-centric user (like OPERATOR_ACT), have only the hospitalId field set, not the scope field.
 * On the contrary, for regional user (REGIONAL_SUPERVISOR), it has only the scope field set with the list of all hostpitals he manages.
 * For the national user, he doesn't have neither the hostpitalId nor the scope set. It means then that he as access to everything.
 */

import { getReferenceData } from "./init"
import {
  ADMIN_HOSPITAL,
  canAccessAllHospitals,
  GUEST_HOSPITAL,
  OPERATOR_ACT,
  OPERATOR_EMPLOYMENT,
  OPERATOR_GENERIC,
  PUBLIC_SUPERVISOR,
  REGIONAL_SUPERVISOR,
  SUPER_ADMIN,
} from "./roles"

export const buildScope = (currentUser = {}) => {
  const scope = currentUser?.scope || []
  const id = currentUser?.hospital?.id ? [currentUser.hospital.id] : []
  return [...scope, ...id]
}

/**
 * Get available hospitals of user
 *
 * @param {*} user
 * @returns array of hospitals
 */
export function hospitalsOfUser(user) {
  const scopeUser = buildScope(user)
  const hospitals = canAccessAllHospitals(user)
    ? getReferenceData("hospitals")
    : getReferenceData("hospitals").filter((hospital) => scopeUser.includes(hospital.id))

  return hospitals
}

/**
 * Permet de vérifier si l'utilisateur est autorisé à visionner les données d'une liste d'hôpitaux
 * @param {*} currentUser Utilisateur courant
 * @param {*} hospitalsQuery Liste d'hôpitaux demandés dans la requête
 * @returns Boolean indiquant si l'utilisateur est autorisé ou non
 */
export const isAllowedHospitals = (currentUser, hospitalsQuery) => {
  switch (currentUser.role) {
    case ADMIN_HOSPITAL:
      return checkScopeFromQuery(currentUser, hospitalsQuery)
    case GUEST_HOSPITAL:
      return checkScopeFromQuery(currentUser, hospitalsQuery)
    case OPERATOR_ACT:
      return checkScopeFromQuery(currentUser, hospitalsQuery)
    case OPERATOR_EMPLOYMENT:
      return checkScopeFromQuery(currentUser, hospitalsQuery)
    case OPERATOR_GENERIC:
      return checkScopeFromQuery(currentUser, hospitalsQuery)
    case REGIONAL_SUPERVISOR:
      return checkScopeFromQuery(currentUser, hospitalsQuery)
    case PUBLIC_SUPERVISOR:
      return true
    case SUPER_ADMIN:
      return true
    default:
      return false
  }
}

const checkScopeFromQuery = (currentUser, hospitalsQuery) => {
  if (!hospitalsQuery || hospitalsQuery.length === 0) return false

  const hospitals = !Array.isArray(hospitalsQuery) ? hospitalsQuery.split(",").map(Number) : hospitalsQuery
  const scope = buildScope(currentUser)

  /**
   * On parcourt chaque hôpital de la requête : s'il n'est
   * pas dans le scope de l'utilisateur, on refuse l'accès.
   */
  let isAllowed = true
  hospitals.forEach((hospital) => {
    if (!scope.includes(hospital)) {
      isAllowed = false
    }
  })

  return isAllowed
}
