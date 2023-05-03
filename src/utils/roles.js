export const HOSPITAL_DETAILS_MANAGEMENT = "HOSPITAL_DETAILS_MANAGEMENT" // peut modifier les informations de l'ETS
export const ACT_CONSULTATION = "ACT_CONSULTATION" // peut consulter les actes d'un ou plusieurs ETS
export const ACT_MANAGEMENT = "ACT_MANAGEMENT" // peut ajouter/modifier les actes pour un ou plusieurs ETS
export const EMPLOYMENT_CONSULTATION = "EMPLOYMENT_CONSULTATION" // peut consulter les ETP pour un ou plusieurs ETS
export const EMPLOYMENT_MANAGEMENT = "EMPLOYMENT_MANAGEMENT" // peut ajouter/modifier les ETP pour un ou plusieurs ETS
export const STATS_LOCAL = "STATS_LOCAL" // peut voir les stats pour un ou plusieurs ETS
export const STATS_GLOBAL = "STATS_GLOBAL" // peut voir les stats publiques
export const ADD_USER = "ADD_USER" // peut ajouter un utilisateur
export const ADD_TYPE_VIOLENCE = "ADD_TYPE_VIOLENCE" // peut ajouter des types de violences occasionnellement (attentat, etc.)
export const NO_PRIVILEGE_REQUIRED = "NO_PRIVILEGE_REQUIRED"
export const ADMIN = "ADMIN"

export const ADMIN_HOSPITAL = "ADMIN_HOSPITAL"
export const GUEST_HOSPITAL = "GUEST_HOSPITAL"
export const OPERATOR_ACT = "OPERATOR_ACT"
export const OPERATOR_EMPLOYMENT = "OPERATOR_EMPLOYMENT"
export const OPERATOR_GENERIC = "OPERATOR_GENERIC"
export const REGIONAL_SUPERVISOR = "REGIONAL_SUPERVISOR"
export const PUBLIC_SUPERVISOR = "PUBLIC_SUPERVISOR"
export const SUPER_ADMIN = "SUPER_ADMIN"

export const PRIVILEGES = [
  HOSPITAL_DETAILS_MANAGEMENT,
  ACT_CONSULTATION,
  ACT_MANAGEMENT,
  EMPLOYMENT_CONSULTATION,
  EMPLOYMENT_MANAGEMENT,
  STATS_LOCAL,
  STATS_GLOBAL,
  ADD_USER,
  ADD_TYPE_VIOLENCE,
  NO_PRIVILEGE_REQUIRED,
  ADMIN,
]

export const ROLES = {
  ADMIN_HOSPITAL: [
    // ex: le responsable d'un UMJ et/ou d'un IML
    ADD_USER,
    HOSPITAL_DETAILS_MANAGEMENT,
    ACT_CONSULTATION,
    ACT_MANAGEMENT,
    EMPLOYMENT_CONSULTATION,
    EMPLOYMENT_MANAGEMENT,
    STATS_LOCAL,
    STATS_GLOBAL,
    ADMIN,
  ],
  // un gestionnaire d'actes et d'ETP
  GUEST_HOSPITAL: [ACT_CONSULTATION, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL],

  OPERATOR_ACT: [ACT_CONSULTATION, ACT_MANAGEMENT, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL],
  // un gestionnaire d'acte
  OPERATOR_EMPLOYMENT: [EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT, ACT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL],
  // un gestionnaire d'ETP
  OPERATOR_GENERIC: [
    EMPLOYMENT_CONSULTATION,
    EMPLOYMENT_MANAGEMENT,
    ACT_CONSULTATION,
    ACT_MANAGEMENT,
    STATS_LOCAL,
    STATS_GLOBAL,
  ],

  // un ARS par exemple
  PUBLIC_SUPERVISOR: [ACT_CONSULTATION, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL],

  // le super admin qui a tous les privilèges
  REGIONAL_SUPERVISOR: [ACT_CONSULTATION, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL],
  SUPER_ADMIN: PRIVILEGES, // ex: un superviseur public, tel que ARS, Ministère de la justice
}

export const ROLES_DESCRIPTION = {
  ADMIN_HOSPITAL: "Administrateur d'UMJ ou d'IML",
  // no scope, 1 hospital_id
  GUEST_HOSPITAL: "Invité (ex: inspections générales, cour des comptes..)",

  // no scope, 1 hospital_id
  OPERATOR_ACT: "Gestionnaire d'actes",
  // no scope, 1 hospital_id
  OPERATOR_EMPLOYMENT: "Gestionnaire d'ETP",
  // no scope, 1 hospital_id
  OPERATOR_GENERIC: "Gestionnaire d'actes et d'ETP", // no scope, 1 hospital_id
  PUBLIC_SUPERVISOR: "Ministères", // no scope, no hospital_id
  REGIONAL_SUPERVISOR: "ARS / TGI / CA", // n hospitals in scope, no hospital_id
  SUPER_ADMIN: "Administrateur de Medlé", // no scope, no hospital_id
}

const START_PAGES = {
  ADMIN_HOSPITAL: "/acts",
  OPERATOR_ACT: "/acts",
  OPERATOR_EMPLOYMENT: "/employments",
}

export const startPageForRole = (role) => START_PAGES[role] || "/statistics"

export const availableRolesForUser = (user) => {
  switch (user && user.role) {
    case "SUPER_ADMIN":
      return [
        "ADMIN_HOSPITAL",
        "OPERATOR_ACT",
        "OPERATOR_EMPLOYMENT",
        "OPERATOR_GENERIC",
        "GUEST_HOSPITAL",
        "PUBLIC_SUPERVISOR",
        "REGIONAL_SUPERVISOR",
        "SUPER_ADMIN",
      ]
    case "ADMIN_HOSPITAL":
      return ["OPERATOR_ACT", "OPERATOR_EMPLOYMENT", "OPERATOR_GENERIC"]

    default:
      throw Error("This case is not expected to happen.")
  }
}
export const rulesOfRoles = (role) => {
  const genericProfile = {
    hospitalDisabled: false,
    hospitalRequired: true,
    scopeDisabled: true,
    scopeRequired: false,
  }

  switch (role) {
    case "ADMIN_HOSPITAL":
      return genericProfile
    case "OPERATOR_ACT":
      return genericProfile
    case "OPERATOR_EMPLOYMENT":
      return genericProfile
    case "OPERATOR_GENERIC":
      return genericProfile
    case "GUEST_HOSPITAL":
      return genericProfile
    case "PUBLIC_SUPERVISOR":
      return {
        hospitalDisabled: true,
        hospitalRequired: false,
        scopeDisabled: true,
        scopeRequired: false,
      }
    case "REGIONAL_SUPERVISOR":
      return {
        hospitalDisabled: true,
        hospitalRequired: false,
        scopeDisabled: false,
        scopeRequired: true,
      }
    case "SUPER_ADMIN":
      return {
        hospitalDisabled: true,
        hospitalRequired: false,
        scopeDisabled: true,
        scopeRequired: false,
      }

    default:
      return {
        hospitalDisabled: false,
        hospitalRequired: false,
        scopeDisabled: false,
        scopeRequired: false,
      }
  }
}

export const canAccessAllHospitals = (user) => [SUPER_ADMIN, PUBLIC_SUPERVISOR].includes(user?.role)

export const isAllowed = (role, privilege) =>
  privilege === NO_PRIVILEGE_REQUIRED || (ROLES[role] && ROLES[role].includes(privilege))
