import { compare, hash } from "bcryptjs"

// Façade for bcrypt functions
export const hashPassword = async (password) => await hash(password, 10)

export const compareWithHash = async (password, hash) => compare(password, hash)
