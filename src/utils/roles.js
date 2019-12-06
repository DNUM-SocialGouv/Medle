export const HOSPITAL_DETAILS_MANAGEMENT = "HOSPITAL_DETAILS_MANAGEMENT" // peut modifier les informations de l'ETS
export const ACT_CONSULTATION = "ACT_CONSULTATION" // peut consulter les actes d'un ou plusieurs ETS
export const ACT_MANAGEMENT = "ACT_MANAGEMENT" // peut ajouter/modifier les actes pour un ou plusieurs ETS
export const EMPLOYMENT_CONSULTATION = "EMPLOYMENT_CONSULTATION" // peut consulter les ETP pour un ou plusieurs ETS
export const EMPLOYMENT_MANAGEMENT = "EMPLOYMENT_MANAGEMENT" // peut ajouter/modifier les ETP pour un ou plusieurs ETS
export const STATS_LOCAL = "STATS_LOCAL" // peut voir les stats pour un ou plusieurs ETS
export const STATS_GLOBAL = "STATS_GLOBAL" // peut voir les stats publiques
export const ADD_USER_ADMIN_ACT = "ADD_USER_ADMIN_ACT" // peut ajouter un utilisateur qui aura le pouvoir d'ajouter des gestionnaires d'actes pour un ou plusieurs ETS
export const ADD_USER_ADMIN_EMPLOYMENT = "ADD_USER_ADMIN_EMPLOYMENT" // peut ajouter un utilisateur qui aura le pouvoir d'ajouter des gestionnaires d'ETP pour un ou plusieurs ETS
export const ADD_USER_OPERATOR_ACT = "ADD_USER_OPERATOR_ACT" // peut ajouter un utilisateur gestionnaire d'actes pour un ou plusieurs ETS
export const ADD_USER_OPERATOR_EMPLOYMENT = "ADD_USER_OPERATOR_EMPLOYMENT" // peut ajouter un utilisateur gestionnaire d'ETP pour un ou plusieurs ETS
export const ADD_USER_SUPERVISOR_HOSPITAL = "ADD_USER_SUPERVISOR_HOSPITAL" // peut ajouter un utilisateur type directeur d'ETS, qui pourra superviser les actes et les ETP pour un ou plusieurs ETS
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
   ADD_USER_ADMIN_ACT,
   ADD_USER_ADMIN_EMPLOYMENT,
   ADD_USER_OPERATOR_ACT,
   ADD_USER_OPERATOR_EMPLOYMENT,
   ADD_USER_SUPERVISOR_HOSPITAL,
   ADD_USER_ADMIN_HOSPITAL,
   ADD_TYPE_VIOLENCE,
]

export const ROLES = {
   SUPERVISOR_HOSPITAL: [ACT_CONSULTATION, EMPLOYMENT_CONSULTATION, STATS_LOCAL, STATS_GLOBAL], // ex: directeur d'ETS
   MAIN_ADMIN_HOSPITAL: [
      // ex: le responsable dans le cas où il chapeaute à la fois un UMJ et un IML
      ADD_USER_ADMIN_ACT,
      ADD_USER_ADMIN_EMPLOYMENT,
      ADD_USER_OPERATOR_ACT,
      ADD_USER_OPERATOR_EMPLOYMENT,
      HOSPITAL_DETAILS_MANAGEMENT,
      ACT_CONSULTATION,
      ACT_MANAGEMENT,
      STATS_LOCAL,
      STATS_GLOBAL,
   ],
   ADMIN_ACT: [
      // ex: le respsable d'un UMJ ou d'un IML
      ADD_USER_OPERATOR_ACT,
      HOSPITAL_DETAILS_MANAGEMENT,
      ACT_CONSULTATION,
      ACT_MANAGEMENT,
      STATS_GLOBAL,
   ],
   ADMIN_EMPLOYMENT: [
      // ex: le responsable RH ou financier
      ADD_USER_OPERATOR_EMPLOYMENT,
      HOSPITAL_DETAILS_MANAGEMENT,
      EMPLOYMENT_CONSULTATION,
      EMPLOYMENT_MANAGEMENT,
      STATS_GLOBAL,
   ],
   OPERATOR_ACT: [ACT_CONSULTATION, ACT_MANAGEMENT, STATS_GLOBAL], // un gestionnaire d'acte
   OPERATOR_EMPLOYMENT: [EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT, STATS_GLOBAL], // un gestionnaire d'ETP
   SUPER_ADMIN: PRIVILEGES, // le super admin qui a tous les privilèges
   PUBLIC_SUPERVISOR: [STATS_LOCAL, STATS_GLOBAL], // ex: un superviseur public, tel que ARS, Ministère de la justice
}

export const isAllowed = (role, privilege) => ROLES[role] && ROLES[role].includes(privilege)
