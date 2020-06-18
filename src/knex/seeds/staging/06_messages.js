exports.seed = function (knex) {
  return knex("messages")
    .then(function () {
      return knex("messages").insert([
        {
          start_date: "2020-06-16",
          content:
            "(Environnement de recette) La saisie des ETP pour les IML est maintenant rétablie. Nous vous rappelons que la saisie des ETP (UMJ, IML) sur cet observatoire reste obligatoire du 1er janvier 2020 et jusqu'à la totale bascule de toutes les structures sur la plateforme MEDLE actuellement en déploiement.",
        },
      ])
    })
    .then(function () {
      return knex.raw(
        "select pg_catalog.setval(pg_get_serial_sequence('messages', 'id'), (select max(id) from messages) + 1);"
      )
    })
}
