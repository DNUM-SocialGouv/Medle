/**
 * In DB, the hospital-centric user (like OPERATOR_ACT), have only the hospitalId field set, not the scope field.
 * On the contrary, for regional user (REGIONAL_SUPERVISOR), it has only the scope field set with the list of all hostpitals he manages.
 * For the national user, he doesn't have neither the hostpitalId nor the scope set. It means then that he as access to everything.
 */
export const buildScope = (currentUser = {}) => {
  const scope = currentUser.scope || []
  const id = currentUser.hospital?.id ? [currentUser.hospital.id] : []
  return [...scope, ...id]
}
