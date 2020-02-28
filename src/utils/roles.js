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
export const NO_PRIVILEGE_REQUIRED = "NO_PRIVILEGE_REQUIRED"

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
   OPERATOR_ACT: [ACT_CONSULTATION, ACT_MANAGEMENT, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL], // un gestionnaire d'acte
   OPERATOR_EMPLOYMENT: [EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT, ACT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL], // un gestionnaire d'ETP
   OPERATOR_GENERIC: [
      EMPLOYMENT_CONSULTATION,
      EMPLOYMENT_MANAGEMENT,
      ACT_CONSULTATION,
      ACT_MANAGEMENT,
      STATS_LOCAL,
      STATS_GLOBAL,
   ], // un gestionnaire d'actes et d'ETP
   GUEST_HOSPITAL: [ACT_CONSULTATION, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL],
   SUPER_ADMIN: PRIVILEGES, // le super admin qui a tous les privilèges
   REGIONAL_SUPERVISOR: [ACT_CONSULTATION, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL], // un ARS par exemple
   PUBLIC_SUPERVISOR: [STATS_LOCAL, STATS_GLOBAL], // ex: un superviseur public, tel que ARS, Ministère de la justice
}

export const ROLES_DESCRIPTION = {
   ADMIN_HOSPITAL: "Administrateur d'UMJ ou d'IML", // no scope, 1 hospital_id
   OPERATOR_ACT: "Gestionnaire d'actes", // no scope, 1 hospital_id
   OPERATOR_EMPLOYMENT: "Gestionnaire d'emplois", // no scope, 1 hospital_id
   OPERATOR_GENERIC: "Gestionnaire d'actes et ETP", // no scope, 1 hospital_id
   GUEST_HOSPITAL: "Invité", // no scope, 1 hospital_id
   SUPER_ADMIN: "Administrateur de Medlé", // no scope, no hospital_id
   PUBLIC_SUPERVISOR: "Superviseur publique", // no scope, no hospital_id
   REGIONAL_SUPERVISOR: "Superviseur de plusieurs UMJ ou IML", // n hospitals in scope, no hospital_id
}

export const START_PAGES = {
   OPERATOR_EMPLOYMENT: "/fillEmployments",
   OPERATOR_ACT: "/actsList",
   OPERATOR_GENERIC: "/actsList",
}

export const isAllowed = (role, privilege) =>
   privilege === NO_PRIVILEGE_REQUIRED || (ROLES[role] && ROLES[role].includes(privilege))
