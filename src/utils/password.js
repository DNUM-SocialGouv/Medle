/**
 * Password validation rules:
 * - Minimum 12 characters
 * - At least 1 lowercase letter
 * - At least 1 uppercase letter
 * - At least 1 digit
 * - At least 1 special character
 */
const PASSWORD_PATTERN = /^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/

export const validatePasswordFormat = (password) => {
  if (!password) {
    return false
  }
  return PASSWORD_PATTERN.test(password)
}

export const getPasswordRequirements = () => {
  return "Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial."
}
