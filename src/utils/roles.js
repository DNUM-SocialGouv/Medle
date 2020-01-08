export const HOSPITAL_DETAILS_MANAGEMENT = "HOSPITAL_DETAILS_MANAGEMENT" // peut modifier les informations de l'ETS
export const ACT_CONSULTATION = "ACT_CONSULTATION" // peut consulter les actes d'un ou plusieurs ETS
export const ACT_MANAGEMENT = "ACT_MANAGEMENT" // peut ajouter/modifier les actes pour un ou plusieurs ETS
export const EMPLOYMENT_CONSULTATION = "EMPLOYMENT_CONSULTATION" // peut consulter les ETP pour un ou plusieurs ETS
export const EMPLOYMENT_MANAGEMENT = "EMPLOYMENT_MANAGEMENT" // peut ajouter/modifier les ETP pour un ou plusieurs ETS
export const STATS_LOCAL = "STATS_LOCAL" // peut voir les stats pour un ou plusieurs ETS
export const STATS_GLOBAL = "STATS_GLOBAL" // peut voir les stats publiques
export const ADD_USER_OPERATOR_ACT = "ADD_USER_OPERATOR_ACT" // peut ajouter un utilisateur gestionnaire d'actes pour un ou plusieurs ETS
export const ADD_USER_OPERATOR_EMPLOYMENT = "ADD_USER_OPERATOR_EMPLOYMENT" // peut ajouter un utilisateur gestionnaire d'ETP pour un ou plusieurs ETS
export const ADD_USER_ADMIN_HOSPITAL = "ADD_USER_ADMIN_HOSPITAL" // peut ajouter un utilisateur administrateur d'un ETS pouvant créer des administrateurs d'actes et des administrateurs d'ETP pour un ou plusieurs ETS
export const ADD_TYPE_VIOLENCE = "ADD_TYPE_VIOLENCE" // peut ajouter des types de violences occasionnellement (attentat, etc.)

export const PRIVILEGES = [
   HOSPITAL_DETAILS_MANAGEMENT,
   ACT_CONSULTATION,
   ACT_MANAGEMENT,
   EMPLOYMENT_CONSULTATION,
   EMPLOYMENT_MANAGEMENT,
   STATS_LOCAL,
   STATS_GLOBAL,
   ADD_USER_OPERATOR_ACT,
   ADD_USER_OPERATOR_EMPLOYMENT,
   ADD_USER_ADMIN_HOSPITAL,
   ADD_TYPE_VIOLENCE,
]

export const ROLES = {
   ADMIN_HOSPITAL: [
      // ex: le responsable d'un UMJ et/ou d'un IML
      ADD_USER_OPERATOR_ACT,
      ADD_USER_OPERATOR_EMPLOYMENT,
      HOSPITAL_DETAILS_MANAGEMENT,
      ACT_CONSULTATION,
      ACT_MANAGEMENT,
      EMPLOYMENT_CONSULTATION,
      EMPLOYMENT_MANAGEMENT,
      STATS_LOCAL,
      STATS_GLOBAL,
   ],
   OPERATOR_ACT: [ACT_CONSULTATION, ACT_MANAGEMENT, STATS_LOCAL, STATS_GLOBAL], // un gestionnaire d'acte
   OPERATOR_EMPLOYMENT: [EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT, STATS_LOCAL, STATS_GLOBAL], // un gestionnaire d'ETP
   GUEST_HOSPITAL: [ACT_CONSULTATION, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL],
   SUPER_ADMIN: PRIVILEGES, // le super admin qui a tous les privilèges
   PUBLIC_SUPERVISOR: [STATS_LOCAL, STATS_GLOBAL], // ex: un superviseur public, tel que ARS, Ministère de la justice
}

export const START_PAGES = {
   OPERATOR_EMPLOYMENT: "/fillEmployments",
   OPERATOR_ACT: "/actDeclaration",
}

export const isAllowed = (role, privilege) => ROLES[role] && ROLES[role].includes(privilege)
