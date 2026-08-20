const USERS_PURGE_INACTIVITY_DAYS = "users_purge_inactivity_days"
const DEFAULT_USERS_PURGE_INACTIVITY_DAYS = 365

const parsePositiveInteger = (value, defaultValue) => {
  const parsedValue = parseInt(value, 10)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : defaultValue
}

const getUsersPurgeInactivityDays = async (knex) => {
  const [setting] = await knex("app_settings").where("key", USERS_PURGE_INACTIVITY_DAYS).select("value")

  return parsePositiveInteger(setting?.value, DEFAULT_USERS_PURGE_INACTIVITY_DAYS)
}

const updateUsersPurgeInactivityDays = async (knex, value) => {
  const usersPurgeInactivityDays = parsePositiveInteger(value, null)

  await knex("app_settings")
    .where("key", USERS_PURGE_INACTIVITY_DAYS)
    .update({ value: String(usersPurgeInactivityDays) })

  return usersPurgeInactivityDays
}

module.exports = {
  DEFAULT_USERS_PURGE_INACTIVITY_DAYS,
  getUsersPurgeInactivityDays,
  updateUsersPurgeInactivityDays,
}