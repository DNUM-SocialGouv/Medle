const knexConfig = require("../../knexfile")
const { getUsersPurgeInactivityDays } = require("../services/app-settings")

const environment = process.env.NODE_ENV || "development"
const knex = require("knex")(knexConfig[environment])

exports.purgeDeletedUsers = async () => {
  try {
    const retentionDays = await getUsersPurgeInactivityDays(knex)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    const usersToPurge = await knex("users")
      .where(function () {
        this.whereNotNull("deleted_at").orWhere("last_login_at", "<=", cutoffDate)
      })
      .select("id")

    const userIdsToDelete = usersToPurge.map(({ id }) => id)

    // Set added_by to null for all acts linked to users being deleted
    if (userIdsToDelete.length > 0) {
      await knex("acts")
        .whereIn("added_by", userIdsToDelete)
        .update({ added_by: null })
    }

    // Delete the users completely
    await Promise.all(
      userIdsToDelete.map((id) =>
        knex("users")
          .where("id", id)
          .delete()
      )
    )

    console.log(`${usersToPurge.length} compte(s) utilisateur supprimé(s)`)
    return usersToPurge.length
  } catch (e) {
    console.error("Error Knex Cron purge users :", e)
  }
}